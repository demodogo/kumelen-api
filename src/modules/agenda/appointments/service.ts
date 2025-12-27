import type {
  AppointmentListQuery,
  CreateAppointmentInput,
  PublicCreateAppointmentInput,
  UpdateAppointmentInput,
} from './types.js';
import { appointmentsRepository } from './repository.js';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../../shared/errors/app-errors.js';
import { appLogsRepository } from '../../app-logs/repository.js';
import { type DayOfWeek, EntityType, LogAction } from '@prisma/client';
import { customersRepository } from '../../clients/repository.js';
import {
  buildAppointmentsOverlapDayWhere,
  BUSINESS_TIMEZONE,
  clampInterval,
  DAY_END_MIN,
  DAY_START_MIN,
  filterByDuration,
  getDayOfWeek,
  getDayRangeUtcFromLocalDate,
  mergeIntervals,
  parseIsoToUtcDate,
  sanitizeAppointment,
  subtractIntervals,
  toHHmm,
  toMinutes,
} from './helpers.js';
import { prisma } from '../../../db/prisma.js';
import {
  sendClientAppointmentConfirmation,
  sendKumelenAppointmentConfirmation,
} from '../../notifications/service.js';
import { logger } from '../../../core/logger.js';

export async function listAppointments(query: AppointmentListQuery) {
  const { page, pageSize, therapistId, customerId, status, startDate, endDate } = query;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return appointmentsRepository.findMany({
    therapistId,
    customerId,
    status,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    skip,
    take,
  });
}

export async function getAppointmentById(id: string) {
  const appointment = await appointmentsRepository.findById(id);
  if (!appointment) {
    throw new NotFoundError('Cita no encontrada');
  }
  return sanitizeAppointment(appointment);
}

export async function createAppointment(authedId: string, data: CreateAppointmentInput) {
  const service = await appointmentsRepository.findByServiceId(data.serviceId);
  if (!service) {
    throw new NotFoundError('Servicio no encontrado');
  }

  let customerId: string;

  if (data.customerId) {
    const existingCustomer = await customersRepository.findById(data.customerId);
    if (!existingCustomer) {
      throw new NotFoundError('Cliente no encontrado');
    }
    customerId = data.customerId;
  } else if (data.customerData) {
    const duplicates: string[] = [];

    if (data.customerData.email) {
      const existingByEmail = await customersRepository.findByEmail(data.customerData.email);
      if (existingByEmail) {
        duplicates.push(`email "${data.customerData.email}"`);
      }
    }

    if (data.customerData.phone) {
      const existingByPhone = await customersRepository.findByPhone(data.customerData.phone);
      if (existingByPhone) {
        duplicates.push(`teléfono "${data.customerData.phone}"`);
      }
    }

    if (data.customerData.rut) {
      const existingByRut = await customersRepository.findByRut(data.customerData.rut);
      if (existingByRut) {
        duplicates.push(`RUT "${data.customerData.rut}"`);
      }
    }

    if (duplicates.length > 0) {
      throw new ConflictError(
        `Ya existe un cliente con el ${duplicates.join(', ')}. Use el ID del cliente existente.`
      );
    }

    const newCustomer = await customersRepository.create({
      name: data.customerData.name,
      lastName: data.customerData.lastName,
      email: data.customerData.email,
      phone: data.customerData.phone,
      rut: data.customerData.rut,
    });

    customerId = newCustomer.id;
  } else {
    throw new BadRequestError('Debe proporcionar customerId o customerData');
  }

  const startAt = parseIsoToUtcDate(data.startAt);
  if (Number.isNaN(startAt.getTime())) {
    throw new BadRequestError('startAt inválido');
  }

  const endAt = new Date(startAt.getTime() + service.durationMinutes * 60_000);

  let therapistId = data.therapistId;
  if (!therapistId) {
    therapistId =
      (await findAvailableTherapist({ serviceId: data.serviceId, startAt, endAt })) ?? undefined;
    if (!therapistId) {
      logger.warn(
        {
          serviceId: data.serviceId,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          durationMinutes: service.durationMinutes,
        },
        'createPublicAppointment: no available therapist found'
      );
      throw new ConflictError('No hay terapeutas disponibles para esta fecha y hora');
    }
  }

  logger.debug(
    {
      serviceId: data.serviceId,
      therapistId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    },
    'createPublicAppointment: therapist resolved'
  );

  const conflict = await prisma.appointment.findFirst({
    where: {
      therapistId,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true },
  });

  if (conflict) {
    logger.warn(
      {
        serviceId: data.serviceId,
        therapistId,
        conflictAppointmentId: conflict.id,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      },
      'createPublicAppointment: conflict found for therapist'
    );
    throw new ConflictError('Horario no disponible');
  }

  const appointment = await appointmentsRepository.create({
    ...data,
    customerId,
    therapistId,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
  });

  if (!appointment) {
    throw new InternalServerError('Error al crear la cita');
  }

  await appLogsRepository.createLog({
    userId: authedId,
    entity: EntityType.APPOINTMENT,
    entityId: appointment.id,
    action: LogAction.CREATE,
  });

  await sendKumelenAppointmentConfirmation(appointment);
  await sendClientAppointmentConfirmation(appointment);
  return sanitizeAppointment(appointment);
}

export async function updateAppointment(
  authedId: string,
  id: string,
  data: UpdateAppointmentInput
) {
  const existing = await appointmentsRepository.findById(id);
  if (!existing) {
    throw new NotFoundError('Cita no encontrada');
  }

  const serviceId = data.serviceId ?? existing.serviceId;
  const service = await appointmentsRepository.findByServiceId(serviceId);
  if (!service) {
    throw new NotFoundError('Servicio no encontrado');
  }

  const therapistId = data.therapistId ?? existing.therapistId ?? undefined;
  const startAt = data.startAt ? parseIsoToUtcDate(data.startAt) : existing.startAt;
  if (data.startAt && Number.isNaN(startAt.getTime())) {
    throw new BadRequestError('startAt inválido');
  }

  const mustRecomputeEndAt = data.startAt !== undefined || data.serviceId !== undefined;
  const endAt = mustRecomputeEndAt
    ? new Date(startAt.getTime() + service.durationMinutes * 60_000)
    : existing.endAt;

  if (data.startAt && therapistId) {
    const conflict = await prisma.appointment.findFirst({
      where: {
        therapistId,
        id: { not: id },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
      select: { id: true },
    });

    if (conflict) {
      throw new ConflictError('Horario no disponible');
    }
  }

  const appointment = await appointmentsRepository.update(id, {
    ...data,
    ...(mustRecomputeEndAt && { endAt: endAt.toISOString() }),
  });
  if (!appointment) {
    throw new InternalServerError('Error al actualizar la cita');
  }

  await appLogsRepository.createLog({
    userId: authedId,
    entity: EntityType.APPOINTMENT,
    entityId: appointment.id,
    action: LogAction.UPDATE,
  });

  return sanitizeAppointment(appointment);
}

export async function deleteAppointment(authedId: string, id: string): Promise<void> {
  const appointment = await appointmentsRepository.findById(id);
  if (!appointment) {
    throw new NotFoundError('Cita no encontrada');
  }

  await appointmentsRepository.delete(id);

  await appLogsRepository.createLog({
    userId: authedId,
    entity: EntityType.APPOINTMENT,
    entityId: appointment.id,
    action: LogAction.DELETE,
  });
}

export async function findAvailableTherapist(args: {
  serviceId: string;
  startAt: Date;
  endAt: Date;
}) {
  const { serviceId, startAt, endAt } = args;

  logger.debug(
    {
      serviceId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    },
    'findAvailableTherapist: start'
  );

  const startAtLocal = new Date(startAt.toLocaleString('en-US', { timeZone: BUSINESS_TIMEZONE }));
  const dayOfWeek: DayOfWeek = getDayOfWeek(startAtLocal);

  const dayStart = new Date(
    startAtLocal.getFullYear(),
    startAtLocal.getMonth(),
    startAtLocal.getDate()
  );
  const dayEnd = new Date(
    startAtLocal.getFullYear(),
    startAtLocal.getMonth(),
    startAtLocal.getDate() + 1
  );

  const therapists = await prisma.therapist.findMany({
    where: {
      isActive: true,
      services: { some: { serviceId } },
    },
    include: {
      schedule: { where: { dayOfWeek, isActive: true } },
      appointments: {
        where: {
          startAt: { lt: dayEnd },
          endAt: { gt: dayStart },
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
        select: { startAt: true, endAt: true },
      },
    },
  });

  logger.debug(
    {
      serviceId,
      dayOfWeek,
      therapistsCount: therapists.length,
      dayStartLocal: dayStart.toISOString(),
      dayEndLocal: dayEnd.toISOString(),
    },
    'findAvailableTherapist: loaded therapists'
  );
  const startMin = startAtLocal.getHours() * 60 + startAtLocal.getMinutes();
  const endAtLocal = new Date(endAt.toLocaleString('en-US', { timeZone: BUSINESS_TIMEZONE }));
  const endMin = endAtLocal.getHours() * 60 + endAtLocal.getMinutes();

  const discardStats = {
    noSchedule: 0,
    outOfHours: 0,
    conflict: 0,
  };

  for (const t of therapists) {
    if (t.schedule.length === 0) {
      discardStats.noSchedule++;
      continue;
    }
    const sch = t.schedule[0];
    const schStart = Math.max(toMinutes(sch.startTime), DAY_START_MIN);
    const schEnd = Math.min(toMinutes(sch.endTime), DAY_END_MIN);

    if (startMin < schStart || endMin > schEnd) {
      discardStats.outOfHours++;
      continue;
    }
    const conflict = t.appointments.some((apt) => startAt < apt.endAt && endAt > apt.startAt);
    if (conflict) {
      discardStats.conflict++;
      continue;
    }

    logger.info(
      {
        serviceId,
        therapistId: t.id,
        dayOfWeek,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        startMin,
        endMin,
        scheduleStartMin: schStart,
        scheduleEndMin: schEnd,
      },
      'findAvailableTherapist: therapist selected'
    );

    return t.id;
  }

  logger.warn(
    {
      serviceId,
      dayOfWeek,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      startMin,
      endMin,
      therapistsCount: therapists.length,
      discardStats,
    },
    'findAvailableTherapist: no therapist available'
  );

  return null;
}

export async function checkAvailability(
  serviceId: string,
  date: string,
  durationMinutes?: number,
  therapistId?: string
) {
  const service = await appointmentsRepository.findByServiceId(serviceId);
  if (!service) {
    throw new NotFoundError('Servicio no encontrado');
  }

  const serviceDurationMinutes = durationMinutes ?? service.durationMinutes;
  const { dayStartUtc, dayEndUtc } = getDayRangeUtcFromLocalDate(date);
  const dayOfWeek = getDayOfWeek(dayStartUtc);

  const therapistWhere = therapistId
    ? { id: therapistId, isActive: true }
    : {
        isActive: true,
        services: { some: { serviceId } },
      };

  const therapists = await prisma.therapist.findMany({
    where: therapistWhere,
    include: {
      schedule: {
        where: { dayOfWeek, isActive: true },
      },
      appointments: {
        where: buildAppointmentsOverlapDayWhere({ dayStartUtc, dayEndUtc }),
        select: { startAt: true, endAt: true },
      },
    },
  });

  const allFree: { startMin: number; endMin: number }[] = [];

  for (const t of therapists) {
    if (!t.schedule?.length) continue;

    const sch = t.schedule[0];
    const clamped = clampInterval(
      { startMin: toMinutes(sch.startTime), endMin: toMinutes(sch.endTime) },
      DAY_START_MIN,
      DAY_END_MIN
    );
    if (!clamped) continue;

    const working = [clamped];

    const busy = t.appointments
      .map((a) => {
        const startLocal = a.startAt;
        const endLocal = a.endAt;
        const s = startLocal.getHours() * 60 + startLocal.getMinutes();
        const e = endLocal.getHours() * 60 + endLocal.getMinutes();
        return { startMin: s, endMin: e };
      })
      .filter((i) => i.endMin > i.startMin);

    const free = filterByDuration(
      subtractIntervals(working, mergeIntervals(busy)),
      serviceDurationMinutes
    );
    allFree.push(...free);
  }

  const merged = therapistId ? allFree : mergeIntervals(allFree);

  return {
    date,
    timezone: BUSINESS_TIMEZONE,
    serviceId,
    serviceDurationMinutes,
    freeIntervals: merged.map((i) => ({ start: toHHmm(i.startMin), end: toHHmm(i.endMin) })),
  };
}

export async function createPublicAppointment(data: PublicCreateAppointmentInput) {
  logger.info(
    {
      serviceId: data.serviceId,
      startAt: data.startAt,
      hasTherapistId: Boolean(data.therapistId),
    },
    'createPublicAppointment: start'
  );

  const service = await appointmentsRepository.findByServiceId(data.serviceId);
  if (!service) {
    throw new NotFoundError('Servicio no encontrado');
  }

  let customerId: string;
  let existingCustomer = null;

  if (data.customerData.email) {
    existingCustomer = await customersRepository.findByEmail(data.customerData.email);
  }

  if (!existingCustomer && data.customerData.phone) {
    existingCustomer = await customersRepository.findByPhone(data.customerData.phone);
  }

  if (!existingCustomer && data.customerData.rut) {
    existingCustomer = await customersRepository.findByRut(data.customerData.rut);
  }

  if (existingCustomer) {
    if (!existingCustomer.isActive) {
      await customersRepository.reactivateClient(existingCustomer.id);
    }
    customerId = existingCustomer.id;
  } else {
    const newCustomer = await customersRepository.create({
      name: data.customerData.name,
      lastName: data.customerData.lastName,
      email: data.customerData.email,
      phone: data.customerData.phone,
      rut: data.customerData.rut,
    });
    customerId = newCustomer.id;
  }

  const startAt = parseIsoToUtcDate(data.startAt);
  if (Number.isNaN(startAt.getTime())) {
    throw new BadRequestError('startAt inválido');
  }

  const endAt = new Date(startAt.getTime() + service.durationMinutes * 60_000);

  let therapistId = data.therapistId;
  if (!therapistId) {
    therapistId =
      (await findAvailableTherapist({ serviceId: data.serviceId, startAt, endAt })) ?? undefined;
    if (!therapistId) {
      throw new ConflictError('No hay terapeutas disponibles para esta fecha y hora');
    }
  }

  const conflict = await prisma.appointment.findFirst({
    where: {
      therapistId,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true },
  });

  if (conflict) {
    throw new ConflictError('Horario no disponible');
  }

  const appointment = await appointmentsRepository.create({
    customerId,
    therapistId,
    serviceId: data.serviceId,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    status: 'PENDING',
    notes: data.notes,
    clientNotes: data.clientNotes,
  });

  if (!appointment) {
    throw new InternalServerError('Error al crear la cita');
  }

  await sendClientAppointmentConfirmation(appointment);
  await sendKumelenAppointmentConfirmation(appointment);

  return sanitizeAppointment(appointment);
}
