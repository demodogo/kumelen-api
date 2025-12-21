import type { TransportOptions } from 'nodemailer';
import nodemailer from 'nodemailer';
import type { AppointmentWithRelations } from './types.js';
import { getClientAppointmentConfirmationTemplate } from './templates/client-appointment-created.js';
import { getKumelenAppointmentNotificationTemplate } from './templates/kumelen-appointment-created.js';
import { getClientAppointmentReminderTemplate } from './templates/client-appointment-reminder.js';
import { getKumelenAppointmentReminderTemplate } from './templates/kumelen-appointment-reminder.js';

export function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.GMAIL_SMTP_HOST,
    port: process.env.GMAIL_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.GMAIL_SMTP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  } as TransportOptions);
}

type SendEmailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail(options: SendEmailOptions) {
  const transporter = createMailTransporter();
  return await transporter.sendMail(options);
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export async function sendClientAppointmentConfirmation(appointment: AppointmentWithRelations) {
  if (!appointment.customer.email) return;

  const appointmentDate = formatDate(appointment.startAt);
  const appointmentTime = formatTime(appointment.startAt);

  const { html, text } = getClientAppointmentConfirmationTemplate({
    clientName: appointment.customer.name,
    serviceName: appointment.service.name,
    servicePrice: appointment.service.price,
    appointmentDate,
    appointmentTime,
    durationMinutes: appointment.service.durationMinutes,
    notes: appointment.clientNotes || undefined,
    appointmentId: appointment.id,
  });

  await sendEmail({
    from: process.env.GMAIL_SMTP_USER!,
    to: appointment.customer.email,
    subject: '¡Has agendado una cita en Kümelen!',
    text,
    html,
  });
}

export async function sendKumelenAppointmentConfirmation(appointment: AppointmentWithRelations) {
  const appointmentDate = formatDate(appointment.startAt);
  const appointmentTime = formatTime(appointment.startAt);

  const { html, text } = getKumelenAppointmentNotificationTemplate({
    appointmentId: appointment.id,
    appointmentDate,
    appointmentTime,
    clientName: appointment.customer.name,
    servicePrice: appointment.service.price,
    serviceName: appointment.service.name,
    durationMinutes: appointment.service.durationMinutes,
    notes: appointment.clientNotes || undefined,
    clientEmail: appointment.customer.email || undefined,
    clientPhone: appointment.customer.phone || undefined,
  });

  await sendEmail({
    from: process.env.GMAIL_SMTP_USER!,
    to: process.env.GMAIL_SMTP_USER!,
    subject: 'Nueva Cita Reservada',
    text,
    html,
  });
}

export async function sendClientAppointmentReminder(appointment: AppointmentWithRelations) {
  if (!appointment.customer.email) return;
  const appointmentDate = formatDate(appointment.startAt);
  const appointmentTime = formatTime(appointment.startAt);

  const { html, text } = getClientAppointmentReminderTemplate({
    appointmentDate,
    appointmentId: appointment.id,
    appointmentTime,
    clientName: appointment.customer.name,
    serviceName: appointment.service.name,
    durationMinutes: appointment.service.durationMinutes,
  });

  await sendEmail({
    from: process.env.GMAIL_SMTP_USER!,
    to: appointment.customer.email,
    subject: 'Recordatorio de Cita',
    text,
    html,
  });
}

export async function sendKumelenAppointmentReminder(appointment: AppointmentWithRelations) {
  const appointmentDate = formatDate(appointment.startAt);
  const appointmentTime = formatTime(appointment.startAt);

  const { html, text } = getKumelenAppointmentReminderTemplate({
    appointmentDate,
    appointmentId: appointment.id,
    appointmentTime,
    clientName: appointment.customer.name,
    clientEmail: appointment.customer.email || undefined,
    clientPhone: appointment.customer.phone || undefined,
    serviceName: appointment.service.name,
  });

  await sendEmail({
    from: process.env.GMAIL_SMTP_USER!,
    to: process.env.GMAIL_SMTP_USER!,
    subject: 'Recordatorio de Cita',
    text,
    html,
  });
}
