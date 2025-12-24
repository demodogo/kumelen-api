import { formatDuration, formatPrice } from '../utils.js';

type ClientAppointmentConfirmationData = {
  clientName: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  notes?: string;
  appointmentId: string;
};

export function getClientAppointmentConfirmationTemplate(data: ClientAppointmentConfirmationData): {
  html: string;
  text: string;
} {
  const {
    clientName,
    serviceName,
    servicePrice,
    appointmentDate,
    appointmentTime,
    durationMinutes,
    appointmentId,
  } = data;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Tu cita está reservada</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Tu cita para ${serviceName} quedó agendada para ${appointmentDate} a las ${appointmentTime}.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f6;">
  <tr>
    <td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <tr>
          <td style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:6px;background:#8e58d8;"></td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:22px 24px 8px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle" style="padding:0;">
                        <img
                          src="https://kumelen-media.demodo.dev/logo.png"
                          width="50"
                          alt="Kümelen"
                          style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:120px;"
                        />
                      </td>
                      <td align="right" valign="middle" style="padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#565151;font-size:12px;letter-spacing:0.2px;">
                        Confirmación de cita
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 24px 0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                  <div style="font-size:22px;line-height:1.25;font-weight:750;color:#5725c4;">
                    Tu cita está reservada
                  </div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.6;color:#565151;">
                    Hola <strong>${clientName}</strong>, tu cita está agendada.
                  </div>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:18px 24px 0 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #ece7f7;border-radius:16px;background:#fbfaff;">
                    <tr>
                      <td style="padding:18px 18px 6px 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#565151;">
                        <div style="font-size:12px;letter-spacing:0.6px;text-transform:uppercase;color:#8e58d8;font-weight:700;">
                          Detalles de la cita
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 18px 18px 18px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #efeaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                              <div style="font-size:12px;color:#8a8585;">Servicio</div>
                              <div style="font-size:15px;color:#565151;font-weight:700;">${serviceName}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #efeaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="50%" valign="top" style="padding-right:8px;">
                                    <div style="font-size:12px;color:#8a8585;">Fecha</div>
                                    <div style="font-size:15px;color:#565151;font-weight:700;">${appointmentDate}</div>
                                  </td>
                                  <td width="50%" valign="top" style="padding-left:8px;">
                                    <div style="font-size:12px;color:#8a8585;">Hora</div>
                                    <div style="font-size:15px;color:#565151;font-weight:700;">${appointmentTime}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-top:1px solid #efeaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="50%" valign="top" style="padding-right:8px;">
                                    <div style="font-size:12px;color:#8a8585;">Duración</div>
                                    <div style="font-size:15px;color:#565151;font-weight:700;"> ${formatDuration(durationMinutes)}</div>
                                  </td>
                                  <td width="50%" valign="top" style="padding-left:8px;">
                                    <div style="font-size:12px;color:#8a8585;">Valor</div>
                                    <div style="font-size:15px;color:#565151;font-weight:700;">${formatPrice(servicePrice)}</div>
                                  </td>
                                </tr>
                              </table>
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
                <td style="padding:18px 24px 0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#565151;">
                  <div style="font-size:13px;line-height:1.6;color:#565151;">
                    Recomendación: llega con <strong>5–10 minutos</strong> de anticipación. Si necesitas mover la hora, idealmente avísanos con <strong>24 horas</strong>.
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:18px 24px 20px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="#8e58d8" style="border-radius:12px;">
                        <a href="${process.env.WEBSITE_BASE_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=confirm" target="_blank" style="display:inline-block;padding:12px 18px;font-family:sans-serif;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">
                          Confirmar mi cita
                        </a>
                      </td>
                      <td width="80" style="font-size:0;line-height:0;">&nbsp;</td>
                      <td bgcolor="#B85948" style="border-radius:12px;">
                        <a href="${process.env.WEBSITE_BASE_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=cancel" target="_blank" style="display:inline-block;padding:12px 18px;font-family:sans-serif;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">
                          Cancelar mi cita
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
                    Centro Kümelen Antofagasta<br />
                    <a href="https://www.centrokumelen.cl" target="_blank" style="color:#2177d4;text-decoration:underline;">Sitio web</a> •
                    <a href="mailto:${process.env.GMAIL_SMTP_USER || 'contacto@centrokumelen.cl'}"  style="color:#2177d4;text-decoration:underline;">Contacto</a><br />
                    <span style="color:#b0aaaa;">Correo automático, por favor no responder.</span>
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
  ¡CITA CONFIRMADA!
  
  Hola ${clientName}, tu cita ha sido reservada exitosamente.
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TU CITA
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  📅 Fecha: ${appointmentDate}
  🕐 Hora: ${appointmentTime}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DETALLES DEL SERVICIO
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Servicio: ${serviceName}
  Duración: ${formatDuration(durationMinutes)}
  Precio: ${formatPrice(servicePrice)}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INFORMACIÓN IMPORTANTE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  • Por favor, llega 5-10 minutos antes de tu cita
  • Si necesitas cancelar o reprogramar, avísanos con 24 horas de anticipación
  • Trae ropa cómoda para tu sesión
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GESTIONA TU CITA
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Confirmar cita: ${process.env.APP_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=confirm
  
  Cancelar cita: ${process.env.APP_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=cancel
  
  ¿Necesitas reprogramar o tienes dudas?
  📧 Contáctanos: ${process.env.GMAIL_SMTP_USER || 'contacto@centrokumelen.cl'}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  ¡Gracias por confiar en nosotros! 💜
  Estamos emocionados de verte pronto
  
  Kümelen - Centro de Bienestar
  Este es un correo de confirmación automático.
  Por favor, no respondas directamente a este mensaje.
    `;

  return { html, text };
}
