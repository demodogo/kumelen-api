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

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Cita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
                  <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px; font-size: 40px;">✨</div>
                  <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    ¡Cita Confirmada!
                  </h1>
                  <p style="margin: 16px 0 0 0; font-size: 17px; color: rgba(255, 255, 255, 0.95); font-weight: 400; line-height: 1.6;">
                    Hola <strong>${clientName}</strong>, tu cita ha sido reservada exitosamente
                  </p>
                </td>
              </tr>

              <!-- Contenido principal -->
              <tr>
                <td style="padding: 40px;">
                  <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; border: 2px solid rgba(102, 126, 234, 0.1); box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 12px 20px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">💆</span>
                      </div>
                      <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #1e293b; letter-spacing: -0.5px;">
                        Detalles de tu Servicio
                      </h2>
                    </div>
                    
                    <div style="background-color: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 2px solid rgba(102, 126, 234, 0.1);">
                        <span style="display: block; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Servicio</span>
                        <span style="display: block; font-size: 24px; color: #1e293b; font-weight: 700; line-height: 1.3;">${serviceName}</span>
                      </div>
                      
                      <div style="display: table; width: 100%;">
                        <div style="display: table-cell; width: 50%; padding-right: 16px; text-align: center;">
                          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px;">
                            <span style="display: block; font-size: 12px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Duración</span>
                            <span style="display: block; font-size: 20px; color: #92400e; font-weight: 700;">
                              ⏱️ ${formatDuration(durationMinutes)}
                            </span>
                          </div>
                        </div>
                        <div style="display: table-cell; width: 50%; padding-left: 16px; text-align: center;">
                          <div style="background: linear-gradient(135deg, #d9f99d 0%, #bef264 100%); border-radius: 12px; padding: 20px;">
                            <span style="display: block; font-size: 12px; color: #365314; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Precio</span>
                            <span style="display: block; font-size: 24px; color: #365314; font-weight: 800;">
                              ${formatPrice(servicePrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 36px; margin-bottom: 28px; box-shadow: 0 12px 40px rgba(102, 126, 234, 0.35);">
                    <div style="text-align: center;">
                      <div style="font-size: 15px; color: rgba(255, 255, 255, 0.95); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">
                        📅 Tu Cita Programada
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
                  </div>

                  ${
                    notes
                      ? `
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #fbbf24; border-left: 6px solid #f59e0b; border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(251, 191, 36, 0.2);">
                    <div style="display: flex; align-items: flex-start;">
                      <div style="font-size: 28px; margin-right: 16px; line-height: 1;">📝</div>
                      <div style="flex: 1;">
                        <div style="font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Notas Importantes</div>
                        <div style="font-size: 15px; color: #78350f; line-height: 1.7; font-weight: 500;">
                          ${notes.replace(/\n/g, '<br>')}
                        </div>
                      </div>
                    </div>
                  </div>
                  `
                      : ''
                  }

                  <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #60a5fa; border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(96, 165, 250, 0.2);">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1e40af; display: flex; align-items: center; text-transform: uppercase; letter-spacing: 0.5px;">
                      <span style="margin-right: 10px; font-size: 24px;">ℹ️</span>
                      Información Importante
                    </h3>
                    <ul style="margin: 0; padding-left: 24px; color: #1e3a8a; font-size: 15px; line-height: 2; font-weight: 500;">
                      <li style="margin-bottom: 10px;">Por favor, llega <strong style="color: #1e40af;">5-10 minutos antes</strong> de tu cita</li>
                      <li style="margin-bottom: 10px;">Si necesitas cancelar o reprogramar, avísanos con <strong style="color: #1e40af;">24 horas de anticipación</strong></li>
                      <li>Trae ropa cómoda para tu sesión</li>
                    </ul>
                  </div>
                  <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 20px; padding: 36px; margin-top: 32px; border: 2px solid rgba(100, 116, 139, 0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                    <div style="text-align: center; margin-bottom: 28px;">
                      <h3 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px;">
                        Gestiona tu Cita
                      </h3>
                      <p style="margin: 0; font-size: 15px; color: #64748b; font-weight: 500; line-height: 1.6;">
                        Confirma tu asistencia o cancela si no puedes asistir
                      </p>
                    </div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 0 8px;">
                          <a href="${process.env.APP_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=confirm" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 14px; font-size: 16px; font-weight: 700; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35); min-width: 200px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s ease;">
                            ✓ Confirmar Cita
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 16px 8px 0 8px;">
                          <a href="${process.env.APP_URL || 'https://centrokumelen.cl'}/confirmar/${appointmentId}?action=cancel" style="display: inline-block; background-color: #ffffff; color: #ef4444; text-decoration: none; padding: 18px 40px; border-radius: 14px; font-size: 16px; font-weight: 700; border: 3px solid #ef4444; min-width: 200px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);">
                            ✕ Cancelar Cita
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Contacto alternativo -->
                  <div style="text-align: center; margin-top: 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #64748b; font-weight: 500;">
                      ¿Necesitas reprogramar o tienes dudas?
                    </p>
                    <a href="mailto:${process.env.GMAIL_SMTP_USER || 'contacto@centrokumelen.cl'}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);">
                      📧 Contáctanos
                    </a>
                  </div>
                  <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                    <p style="margin: 0; font-size: 18px; color: #1e293b; font-weight: 600; line-height: 1.8;">
                      ¡Gracias por confiar en nosotros! 💜<br>
                      <span style="font-size: 16px; color: #64748b; font-weight: 500;">
                        Estamos emocionados de verte pronto
                      </span>
                    </p>
                  </div>

                </td>
              </tr>
              <tr>
                <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 40px; text-align: center; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                  <p style="margin: 0 0 10px 0; font-size: 15px; color: #1e293b; font-weight: 700; letter-spacing: 0.5px;">
                    Kümelen - Centro de Bienestar
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500; line-height: 1.6;">
                    Este es un correo de confirmación automático.<br>
                    Por favor, no respondas directamente a este mensaje.
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
${notes ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNOTAS IMPORTANTES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${notes}\n` : ''}
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
