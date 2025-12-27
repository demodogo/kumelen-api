type KumelenAppointmentNotificationData = {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  notes?: string;
  appointmentId: string;
};

export function getKumelenAppointmentNotificationTemplate(
  data: KumelenAppointmentNotificationData
): { html: string; text: string } {
  const {
    clientName,
    clientEmail,
    clientPhone,
    serviceName,
    servicePrice,
    appointmentDate,
    appointmentTime,
    durationMinutes,
    notes,
    appointmentId,
  } = data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Nueva cita reservada</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Nueva cita: ${serviceName} • ${appointmentDate} ${appointmentTime} • Cliente: ${clientName}.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f6;">
  <tr>
    <td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <tr>
          <td style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:6px;background:#2177d4;"></td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:22px 24px 8px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle">
                        <img  src="https://kumelen-media.demodo.dev/logo.png" width="50" alt="Kümelen" style="display:block;border:0;height:auto;max-width:120px;" />
                      </td>
                      <td align="right" valign="middle" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#565151;font-size:12px;">
                        Notificación de agenda
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:8px 24px 0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                  <div style="font-size:22px;line-height:1.25;font-weight:750;color:#5725c4;">
                    Se reservó una nueva cita
                  </div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.6;color:#565151;">
                    Se reservó una cita desde el sitio
                  </div>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:18px 24px 0 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8eefb;border-radius:16px;background:#f7faff;">
                    <tr>
                      <td style="padding:16px 16px 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                        <div style="font-size:12px;letter-spacing:0.6px;text-transform:uppercase;color:#2177d4;font-weight:700;">
                          Resumen
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 16px 16px 16px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#565151;">
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #e8eefb;">
                              <div style="font-size:12px;color:#8a8585;">Cliente</div>
                              <div style="font-size:15px;font-weight:700;">${clientName}</div>
                              <div style="font-size:13px;color:#565151;">${clientEmail ? `${clientEmail}` : ''} ${clientPhone ? ` • ${clientPhone}` : ''}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #e8eefb;">
                              <div style="font-size:12px;color:#8a8585;">Servicio</div>
                              <div style="font-size:15px;font-weight:700;">${serviceName}</div>
                              <div style="font-size:13px;color:#565151;">Duración: ${formatDuration(durationMinutes)} • Valor: ${formatPrice(servicePrice)}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #e8eefb;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="50%" style="padding-right:8px;">
                                    <div style="font-size:12px;color:#8a8585;">Fecha</div>
                                    <div style="font-size:15px;font-weight:700;">${appointmentDate}</div>
                                  </td>
                                  <td width="50%" style="padding-left:8px;">
                                    <div style="font-size:12px;color:#8a8585;">Hora</div>
                                    <div style="font-size:15px;font-weight:700;">${appointmentTime}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #e8eefb;">
                              <div style="font-size:12px;color:#8a8585;">Notas</div>
                              <div style="font-size:14px;line-height:1.6;">${notes ? notes : 'No especificado'}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding:18px 24px 22px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="#2177d4" style="border-radius:12px;">
                        <a href="${process.env.WEBSITE_BASE_URL || 'https://centrokumelen.cl'}/portal/citas" target="_blank"
                           style="display:inline-block;padding:12px 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">
                          Ver en el panel
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border-top:1px solid #eeeeee;">
              <tr>
                <td style="padding:16px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                  <div style="font-size:12px;color:#8a8585;line-height:1.6;">
                    Kümelen • Notificación automática de reservas.
                  </div>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
  `;
  const text = `
🎉 NUEVA CITA RESERVADA

Un cliente ha reservado una nueva cita en tu agenda.

📅 Reservado el ${today}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FECHA DE LA CITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📆 ${appointmentDate}
🕐 ${appointmentTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMACIÓN DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${clientName}
Email: ${clientEmail || 'No especificado'}${clientPhone ? `\nTeléfono: ${clientPhone}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICIO SOLICITADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Servicio: ${serviceName}
Duración: ${formatDuration(durationMinutes)}
Precio: ${formatPrice(servicePrice)}
${notes ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNOTAS DEL CLIENTE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID DE CITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${appointmentId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCIONES RÁPIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: ${clientEmail || 'No especificado'}${clientPhone ? `\n📱 Teléfono: ${clientPhone}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kümelen - Sistema de Gestión de Citas
Esta notificación fue generada automáticamente.
  `;

  return { html, text };
}
