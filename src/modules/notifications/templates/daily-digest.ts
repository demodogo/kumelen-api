import type { AppointmentWithRelations } from '../types.js';
import nodemailer, { type TransportOptions } from 'nodemailer';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | string;

export type KumelenAppointmentsSectionItem = {
  id: string;
  startAt: Date;
  endAt: Date;
  status: AppointmentStatus;
  clientNotes?: string | null;

  customer: {
    name?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    rut?: string | null;
    notes?: string | null;
  };

  therapist?: {
    name?: string | null;
    lastName?: string | null;
  } | null;

  service: {
    name?: string | null;
    price?: number | null;
  };
};

export type KumelenAppointmentsSectionData = {
  date: Date;
  appointments: KumelenAppointmentsSectionItem[];
  timezone?: string;
  title?: string;
  subtitle?: string;
};

export function getKumelenAppointmentsSectionTemplate(data: KumelenAppointmentsSectionData): {
  html: string;
  text: string;
} {
  const tz = data.timezone ?? 'America/Santiago';
  const title = data.title ?? 'Citas del día';

  const dateLabel =
    data.subtitle ??
    new Intl.DateTimeFormat('es-CL', {
      timeZone: tz,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(data.date);

  const html = renderAppointmentsSectionHtml({
    title,
    dateLabel,
    appointments: data.appointments,
    tz,
  });

  const text = renderAppointmentsSectionText({
    title,
    dateLabel,
    appointments: data.appointments,
    tz,
  });

  return { html, text };
}

function renderAppointmentsSectionHtml(input: {
  title: string;
  dateLabel: string;
  appointments: KumelenAppointmentsSectionItem[];
  tz: string;
}) {
  const preheader = `Agenda: ${input.title} • ${input.dateLabel} • ${input.appointments.length} cita(s).`;

  const body = input.appointments.length
    ? input.appointments.map((a) => renderAppointmentCardHtml(a, input.tz)).join('')
    : `
      <div style="padding:14px 0;color:#6B7280;font-size:13px;line-height:1.4;">
        No hay citas programadas para hoy.
      </div>
    `.trim();

  return `
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  ${escapeHtml(preheader)}
</div>

<div style="background:#ffffff;border:1px solid #eef0f5;border-radius:16px;overflow:hidden;">
  <div style="padding:16px 16px 10px 16px;border-bottom:1px solid #eef0f5;">
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <div style="font-size:16px;line-height:1.25;font-weight:800;color:#111827;">
        ${escapeHtml(input.title)}
      </div>
      <div style="margin-top:6px;font-size:12px;line-height:1.4;color:#6B7280;">
        ${escapeHtml(input.dateLabel)}
      </div>
    </div>
  </div>

  <div style="padding:14px 16px 16px 16px;">
    ${body}
  </div>
</div>
  `.trim();
}

function extractAppointmentData(a: KumelenAppointmentsSectionItem) {
  return {
    customerFullName:
      [a.customer?.name, a.customer?.lastName].filter(Boolean).join(' ') || 'Cliente',
    therapistFullName: a.therapist
      ? [a.therapist?.name, a.therapist?.lastName].filter(Boolean).join(' ') || 'Terapeuta'
      : 'Sin asignar',
    serviceName: a.service?.name || 'Servicio',
    priceLabel: typeof a.service?.price === 'number' ? formatMoneyCLP(a.service.price) : '—',
  };
}

function renderAppointmentCardHtml(a: KumelenAppointmentsSectionItem, tz: string) {
  const timeRange = `${formatTime(a.startAt, tz)} - ${formatTime(a.endAt, tz)}`;
  const status = String(a.status ?? '').toUpperCase();

  const { customerFullName, therapistFullName, serviceName, priceLabel } =
    extractAppointmentData(a);

  const customerMetaParts = [
    a.customer?.rut ? `RUT: ${a.customer.rut}` : null,
    a.customer?.email ? `Email: ${a.customer.email}` : null,
    a.customer?.phone ? `Tel: ${a.customer.phone}` : null,
  ].filter(Boolean) as string[];

  const customerMeta = customerMetaParts.length
    ? `<div style="margin-top:6px;color:#6B7280;font-size:12px;line-height:1.35;">${escapeHtml(
        customerMetaParts.join(' · ')
      )}</div>`
    : '';

  const notesBlocks: string[] = [];
  if (a.clientNotes) {
    notesBlocks.push(
      `<div style="color:#374151;font-size:12px;line-height:1.35;"><b style="color:#111827;">Notas cliente:</b> ${escapeHtml(
        a.clientNotes
      )}</div>`
    );
  }
  if (a.customer?.notes) {
    notesBlocks.push(
      `<div style="color:#374151;font-size:12px;line-height:1.35;margin-top:6px;"><b style="color:#111827;">Notas ficha:</b> ${escapeHtml(
        a.customer.notes
      )}</div>`
    );
  }

  const notesSection = notesBlocks.length
    ? `<div style="margin-top:10px;padding-top:10px;border-top:1px dashed #E5E7EB;">${notesBlocks.join('')}</div>`
    : '';

  return `
<div style="padding:12px 0;border-bottom:1px solid #eef0f5;">
  <div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;">
    <div style="min-width:240px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <div style="color:#111827;font-weight:800;font-size:14px;line-height:1.25;">
        ${escapeHtml(timeRange)}
        <span style="margin-left:8px;${statusPillStyle(status)}">${escapeHtml(status)}</span>
      </div>

      <div style="margin-top:8px;color:#111827;font-size:13px;line-height:1.35;">
        <b>${escapeHtml(customerFullName)}</b>
        <span style="color:#6B7280;"> · ${escapeHtml(serviceName)} · ${escapeHtml(priceLabel)}</span>
      </div>

      ${customerMeta}
    </div>

    <div style="min-width:180px;text-align:right;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <div style="color:#6B7280;font-size:12px;">Terapeuta</div>
      <div style="margin-top:4px;color:#111827;font-size:13px;font-weight:700;">
        ${escapeHtml(therapistFullName)}
      </div>
    </div>
  </div>

  ${notesSection}
</div>
  `.trim();
}

function statusPillStyle(statusUpper: string) {
  const base =
    'display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid #E5E7EB;color:#374151;background:#F9FAFB;';

  if (statusUpper === 'CONFIRMED')
    return base
      .replace('#F9FAFB', '#ECFDF5')
      .replace('#374151', '#065F46')
      .replace('#E5E7EB', '#A7F3D0');
  if (statusUpper === 'PENDING')
    return base
      .replace('#F9FAFB', '#FFFBEB')
      .replace('#374151', '#92400E')
      .replace('#E5E7EB', '#FDE68A');
  if (statusUpper === 'CANCELLED')
    return base
      .replace('#F9FAFB', '#FEF2F2')
      .replace('#374151', '#991B1B')
      .replace('#E5E7EB', '#FECACA');
  if (statusUpper === 'COMPLETED')
    return base
      .replace('#F9FAFB', '#EFF6FF')
      .replace('#374151', '#1D4ED8')
      .replace('#E5E7EB', '#BFDBFE');

  return base;
}

function renderAppointmentsSectionText(input: {
  title: string;
  dateLabel: string;
  appointments: KumelenAppointmentsSectionItem[];
  tz: string;
}) {
  const lines: string[] = [];
  lines.push(`${input.title.toUpperCase()}`);
  lines.push(input.dateLabel);
  lines.push('');
  lines.push(`Total: ${input.appointments.length} cita(s)`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!input.appointments.length) {
    lines.push('No hay citas programadas para hoy.');
    return lines.join('\n');
  }

  input.appointments.forEach((a, idx) => {
    const timeRange = `${formatTime(a.startAt, input.tz)} - ${formatTime(a.endAt, input.tz)}`;
    const status = String(a.status ?? '').toUpperCase();

    const { customerFullName, therapistFullName, serviceName, priceLabel } =
      extractAppointmentData(a);

    lines.push('');
    lines.push(`(${idx + 1}) ${timeRange}  [${status}]`);
    lines.push(`Cliente: ${customerFullName}`);
    if (a.customer?.rut) lines.push(`RUT: ${a.customer.rut}`);
    if (a.customer?.email) lines.push(`Email: ${a.customer.email}`);
    if (a.customer?.phone) lines.push(`Tel: ${a.customer.phone}`);
    lines.push(`Servicio: ${serviceName} (${priceLabel})`);
    lines.push(`Terapeuta: ${therapistFullName}`);

    if (a.clientNotes) {
      lines.push(`Notas cliente: ${stripNewlines(a.clientNotes)}`);
    }
    if (a.customer?.notes) {
      lines.push(`Notas ficha: ${stripNewlines(a.customer.notes)}`);
    }

    lines.push(`ID: ${a.id}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

  return lines.join('\n');
}

function formatMoneyCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

function formatTime(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[c] ?? c;
  });
}

function stripNewlines(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function createMailTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_SMTP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
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

async function sendKumelenDailyResume(appointments: any) {
  const { html, text } = getKumelenAppointmentsSectionTemplate({
    date: new Date(),
    appointments: appointments.map((a: AppointmentWithRelations) => ({
      id: a.id,
      startAt: a.startAt,
      endAt: a.endAt,
      status: a.status,
      clientNotes: a.clientNotes,
      customer: {
        name: a.customer.name,
        lastName: a.customer.lastName,
        email: a.customer.email ?? null,
        phone: a.customer.phone ?? null,
        rut: a.customer.rut ?? null,
      },
      therapist: {
        name: a.therapist?.name,
        lastName: a.therapist?.lastName,
      },
      service: {
        name: a.service.name,
        price: a.service.price,
      },
    })),
  });

  await sendEmail({
    from: process.env.GMAIL_SMTP_USER!,
    to: process.env.GMAIL_SMTP_USER!,
    subject: 'Kümelen: Resumen de hoy',
    text,
    html,
  });
}
