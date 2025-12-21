type ClientAppointmentReminderData = {
  clientName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  appointmentId: string;
};

export function getClientAppointmentReminderTemplate(data: ClientAppointmentReminderData): {
  html: string;
  text: string;
} {
  const {
    clientName,
    serviceName,
    appointmentDate,
    appointmentTime,
    durationMinutes,
    appointmentId,
  } = data;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recordatorio de Cita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 50px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 50px 40px; text-align: center;">
                  <div style="display: inline-block; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px; font-size: 40px;">⏰</div>
                  <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    Recordatorio de Cita
                  </h1>
                  <p style="margin: 16px 0 0 0; font-size: 17px; color: rgba(255, 255, 255, 0.95); font-weight: 400; line-height: 1.6;">
                    Hola <strong>${clientName}</strong>, te recordamos tu próxima cita
                  </p>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Fecha y hora -->
                  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 20px; padding: 36px; margin-bottom: 28px; box-shadow: 0 12px 40px rgba(245, 158, 11, 0.35); text-align: center;">
                    <div style="font-size: 15px; color: rgba(255, 255, 255, 0.95); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">
                      📅 Tu Cita es Pronto
                    </div>
                    <div style="background-color: rgba(255, 255, 255, 0.25); backdrop-filter: blur(20px); border-radius: 16px; padding: 28px; border: 2px solid rgba(255, 255, 255, 0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                      <div style="font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 12px; letter-spacing: -1px; text-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ${appointmentDate}
                      </div>
                      <div style="font-size: 28px; font-weight: 700; color: rgba(255, 255, 255, 0.98); text-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        🕐 ${appointmentTime}
                      </div>
                    </div>
                  </div>

                  <!-- Detalles del servicio -->
                  <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; text-align: center; border: 2px solid rgba(102, 126, 234, 0.15); box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);">
                    <div style="font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
                      💆 Servicio
                    </div>
                    <div style="font-size: 24px; color: #1e293b; font-weight: 800; margin-bottom: 16px; line-height: 1.3;">
                      ${serviceName}
                    </div>
                    <div style="display: inline-block; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 12px 24px;">
                      <span style="font-size: 16px; color: #92400e; font-weight: 700;">
                        ⏱️ ${formatDuration(durationMinutes)}
                      </span>
                    </div>
                  </div>

                  <!-- Recordatorio importante -->
                  <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 3px solid #60a5fa; border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(96, 165, 250, 0.25);">
                    <div style="font-size: 18px; color: #1e40af; line-height: 1.8; text-align: center; font-weight: 700;">
                      💡 <strong>Recuerda llegar 5-10 minutos antes</strong>
                    </div>
                  </div>

                  <!-- Botón cancelar -->
                  <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; border: 2px solid rgba(100, 116, 139, 0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.06); text-align: center;">
                    <p style="margin: 0 0 20px 0; font-size: 17px; color: #1e293b; font-weight: 600;">
                      ¿No podrás asistir?
                    </p>
                    <a href="${process.env.APP_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=cancel" style="display: inline-block; background-color: #ffffff; color: #ef4444; text-decoration: none; padding: 18px 40px; border-radius: 14px; font-size: 16px; font-weight: 700; border: 3px solid #ef4444; min-width: 200px; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25); text-transform: uppercase; letter-spacing: 0.5px;">
                      ✕ Cancelar Cita
                    </a>
                    <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b; font-weight: 500;">
                      Por favor avísanos con 24 horas de anticipación
                    </p>
                  </div>

                  <!-- Contacto -->
                  <div style="text-align: center; margin-top: 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #64748b; font-weight: 500;">
                      ¿Dudas o consultas?
                    </p>
                    <a href="mailto:${process.env.GMAIL_SMTP_USER || 'contacto@centrokumelen.cl'}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);">
                      📧 Contáctanos
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 40px; text-align: center; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                  <p style="margin: 0 0 10px 0; font-size: 15px; color: #1e293b; font-weight: 700; letter-spacing: 0.5px;">
                    Kümelen - Centro de Bienestar
                  </p>
                  <p style="margin: 0; font-size: 16px; color: #64748b; font-weight: 600;">
                    ¡Nos vemos pronto! 💜
                  </p>
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
⏰ RECORDATORIO DE CITA

Hola ${clientName}, te recordamos tu próxima cita.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TU CITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 ${appointmentDate}
🕐 ${appointmentTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${serviceName}
⏱️ Duración: ${formatDuration(durationMinutes)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Recuerda llegar 5-10 minutos antes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿NO PODRÁS ASISTIR?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cancelar cita: ${process.env.APP_URL || 'https://kumelen.cl'}/confirmar/${appointmentId}?action=cancel

Por favor avísanos con 24 horas de anticipación.

¿Dudas o consultas?
📧 Contáctanos: ${process.env.GMAIL_SMTP_USER || 'contacto@kumelen.cl'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kümelen - Centro de Bienestar
¡Nos vemos pronto! 💜
  `;

  return { html, text };
}
