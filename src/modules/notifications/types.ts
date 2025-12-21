import type { Appointment, Customer, Service, Therapist } from '@prisma/client';

export type AppointmentWithRelations = Appointment & {
  customer: Customer;
  therapist: Therapist | null;
  service: Service;
};
