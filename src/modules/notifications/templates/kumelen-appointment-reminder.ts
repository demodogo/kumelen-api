type KumelenAppointmentReminderData = {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentId: string;
};

export function getKumelenAppointmentReminderTemplate(data: KumelenAppointmentReminderData): {
  html: string;
  text: string;
} {
  const {
    clientName,
    clientEmail,
    clientPhone,
    serviceName,
    appointmentDate,
    appointmentTime,
    appointmentId,
  } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recordatorio de Cita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 50px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 50px 40px; text-align: center;">
                  <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px; font-size: 40px;">⏰</div>
                  <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    Recordatorio de Cita
                  </h1>
                  <p style="margin: 16px 0 0 0; font-size: 17px; color: rgba(255, 255, 255, 0.95); font-weight: 400; line-height: 1.6;">
                    Tienes una cita próxima en tu agenda
                  </p>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Fecha y hora -->
                  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 20px; padding: 36px; margin-bottom: 28px; box-shadow: 0 12px 40px rgba(99, 102, 241, 0.35); text-align: center;">
                    <div style="font-size: 15px; color: rgba(255, 255, 255, 0.95); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">
                      📆 Fecha y Hora
                    </div>
                    <div style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); border-radius: 16px; padding: 28px; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                      <div style="font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 12px; letter-spacing: -1px; text-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ${appointmentDate}
                      </div>
                      <div style="font-size: 28px; font-weight: 700; color: rgba(255, 255, 255, 0.98); text-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        🕐 ${appointmentTime}
                      </div>
                    </div>
                  </div>

                  <!-- Info del cliente y servicio -->
                  <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; border: 2px solid rgba(99, 102, 241, 0.15); box-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 20px; border-bottom: 2px solid rgba(99, 102, 241, 0.15);">
                          <div style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">👤 Cliente</div>
                          <div style="font-size: 20px; color: #1e293b; font-weight: 800;">${clientName}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px;">
                          <div style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">💆 Servicio</div>
                          <div style="font-size: 20px; color: #1e293b; font-weight: 800;">${serviceName}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Contacto del cliente -->
                  <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 2px solid #10b981; border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);">
                    <div style="font-size: 14px; color: #065f46; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; text-align: center;">
                      📞 Contacto del Cliente
                    </div>
                    <div style="background-color: #ffffff; border-radius: 12px; padding: 20px;">
                      <div style="margin-bottom: 12px; text-align: center;">
                        ${
                          clientEmail
                            ? `<a href="mailto:${clientEmail}" style="color: #10b981; text-decoration: none; font-size: 16px; font-weight: 700; display: block;">
                          📧 ${clientEmail}
                        </a>`
                            : `<span style="color: #94a3b8; font-size: 16px; font-style: italic; font-weight: 500;">
                          📧 No especificado
                        </span>`
                        }
                      </div>
                      ${
                        clientPhone
                          ? `
                      <div style="text-align: center; padding-top: 12px; border-top: 2px solid rgba(16, 185, 129, 0.15);">
                        <a href="tel:${clientPhone}" style="color: #10b981; text-decoration: none; font-size: 16px; font-weight: 700; display: block;">
                          📱 ${clientPhone}
                        </a>
                      </div>
                      `
                          : ''
                      }
                    </div>
                  </div>

                  <!-- ID de cita -->
                  <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border: 2px solid #94a3b8; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 4px 16px rgba(148, 163, 184, 0.15);">
                    <span style="font-size: 13px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">ID de Cita: </span>
                    <span style="font-size: 16px; color: #1e293b; font-weight: 700; font-family: 'Courier New', monospace;">${appointmentId}</span>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 40px; text-align: center; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #1e293b; font-weight: 700; letter-spacing: 0.5px;">
                    Kümelen - Sistema de Gestión
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">
                    Recordatorio automático
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

Tienes una cita próxima en tu agenda.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FECHA Y HORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📆 ${appointmentDate}
🕐 ${appointmentTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cliente: ${clientName}
Servicio: ${serviceName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACTO DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 ${clientEmail || 'No especificado'}${clientPhone ? `\n📱 ${clientPhone}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID: ${appointmentId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recordatorio automático - Kümelen
  `;

  return { html, text };
}
