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
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Reserva de Cita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 40px; text-align: center;">
                  <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px; font-size: 40px;">🎉</div>
                  <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    Nueva Cita Reservada
                  </h1>
                  <p style="margin: 16px 0 0 0; font-size: 17px; color: rgba(255, 255, 255, 0.95); font-weight: 400; line-height: 1.6;">
                    Un cliente ha reservado una nueva cita en tu agenda
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  
                  <div style="display: inline-block; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; padding: 10px 20px; border-radius: 24px; font-size: 13px; font-weight: 700; margin-bottom: 28px; border: 2px solid #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
                    📅 Reservado el ${today}
                  </div>

                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; padding: 36px; margin-bottom: 28px; box-shadow: 0 12px 40px rgba(16, 185, 129, 0.35);">
                    <div style="text-align: center;">
                      <div style="font-size: 15px; color: rgba(255, 255, 255, 0.95); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">
                        📆 Fecha de la Cita
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

                  <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; border: 2px solid rgba(102, 126, 234, 0.1); box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);">
                    <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 800; color: #1e293b; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">
                      👤 Información del Cliente
                    </h2>
                    
                    <div style="background-color: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding: 12px 0;">
                            <span style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Nombre</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 20px 0;">
                            <span style="font-size: 20px; color: #1e293b; font-weight: 700;">${clientName}</span>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding: 12px 0; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                            <span style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Email</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 20px 0;">
                            ${clientEmail ? `<a href="mailto:${clientEmail}" style="font-size: 17px; color: #10b981; text-decoration: none; font-weight: 600;">${clientEmail}</a>` : `<span style="font-size: 17px; color: #94a3b8; font-style: italic; font-weight: 500;">No especificado</span>`}
                          </td>
                        </tr>
                      
                        ${
                          clientPhone
                            ? `
                        <tr>
                          <td style="padding: 12px 0; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                            <span style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Teléfono</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0;">
                            <a href="tel:${clientPhone}" style="font-size: 17px; color: #10b981; text-decoration: none; font-weight: 600;">${clientPhone}</a>
                          </td>
                        </tr>
                        `
                            : ''
                        }
                      </table>
                    </div>
                  </div>
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; border: 2px solid #fbbf24; box-shadow: 0 4px 20px rgba(251, 191, 36, 0.2);">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; padding: 12px 20px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">💆</span>
                      </div>
                      <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 0.5px;">
                        Servicio Solicitado
                      </h2>
                    </div>
                    
                    <div style="background-color: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 2px solid rgba(120, 53, 15, 0.1);">
                        <span style="display: block; font-size: 24px; color: #78350f; font-weight: 800; line-height: 1.3;">${serviceName}</span>
                      </div>
                      
                      <div style="display: table; width: 100%;">
                        <div style="display: table-cell; width: 50%; padding-right: 16px; text-align: center;">
                          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 20px;">
                            <span style="display: block; font-size: 12px; color: #1e40af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Duración</span>
                            <span style="display: block; font-size: 20px; color: #1e40af; font-weight: 800;">
                              ⏱️ ${formatDuration(durationMinutes)}
                            </span>
                          </div>
                        </div>
                        <div style="display: table-cell; width: 50%; padding-left: 16px; text-align: center;">
                          <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 20px;">
                            <span style="display: block; font-size: 12px; color: #065f46; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Precio</span>
                            <span style="display: block; font-size: 24px; color: #065f46; font-weight: 900;">
                              ${formatPrice(servicePrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  ${
                    notes
                      ? `
                  <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border: 2px solid #818cf8; border-left: 6px solid #6366f1; border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);">
                    <div style="display: flex; align-items: flex-start;">
                      <div style="font-size: 28px; margin-right: 16px; line-height: 1;">📝</div>
                      <div style="flex: 1;">
                        <div style="font-size: 16px; font-weight: 700; color: #3730a3; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Notas del Cliente</div>
                        <div style="font-size: 15px; color: #4338ca; line-height: 1.7; font-weight: 500;">
                          ${notes.replace(/\n/g, '<br>')}
                        </div>
                      </div>
                    </div>
                  </div>
                  `
                      : ''
                  }

                  <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border: 2px solid #94a3b8; border-radius: 16px; padding: 20px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(148, 163, 184, 0.15);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <div>
                        <span style="font-size: 13px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">ID de Cita</span>
                        <div style="font-size: 16px; color: #1e293b; font-weight: 700; font-family: 'Courier New', monospace; margin-top: 6px;">
                          ${appointmentId}
                        </div>
                      </div>
                      <div style="font-size: 32px;">🔖</div>
                    </div>
                  </div>

                  <div style="text-align: center; margin-top: 36px;">
                    <p style="margin: 0 0 24px 0; font-size: 18px; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Acciones Rápidas
                    </p>
                    <div style="display: inline-block;">
                      ${
                        clientEmail
                          ? `<a href="mailto:${clientEmail}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 14px; font-size: 15px; font-weight: 700; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3); margin: 0 8px 12px 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                        📧 Contactar Cliente
                      </a>`
                          : ''
                      }
                      ${
                        clientPhone
                          ? `
                      <a href="tel:${clientPhone}" style="display: inline-block; background-color: #ffffff; color: #10b981; text-decoration: none; padding: 16px 32px; border-radius: 14px; font-size: 15px; font-weight: 700; border: 3px solid #10b981; margin: 0 8px 12px 8px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2); text-transform: uppercase; letter-spacing: 0.5px;">
                        📱 Llamar
                      </a>
                      `
                          : ''
                      }
                    </div>
                  </div>
                  <div style="text-align: center; margin-top: 36px; padding-top: 32px; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                    <div style="display: inline-block; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; padding: 20px 28px; border: 2px solid #60a5fa;">
                      <p style="margin: 0; font-size: 15px; color: #1e40af; font-weight: 600; line-height: 1.6;">
                        💡 Tú y el paciente recibirán correos de recordatorio el día de la cita.
                      </p>
                    </div>
                  </div>

                </td>
              </tr>
              <tr>
                <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 40px; text-align: center; border-top: 2px solid rgba(100, 116, 139, 0.1);">
                  <p style="margin: 0 0 10px 0; font-size: 15px; color: #1e293b; font-weight: 700; letter-spacing: 0.5px;">
                    Kümelen - Sistema de Gestión de Citas
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">
                    Esta notificación fue generada automáticamente
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

💡 Tú y el paciente recibirán correos de recordatorio el día de la cita.

Kümelen - Sistema de Gestión de Citas
Esta notificación fue generada automáticamente.
  `;

  return { html, text };
}
