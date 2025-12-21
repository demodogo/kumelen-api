import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { availabilityQuerySchema, publicCreateAppointmentSchema } from './schema.js';
import { checkAvailability, createPublicAppointment } from './service.js';
import { handleError } from '../../../utils/errors.js';

export const publicAppointmentsRouter = new Hono();

publicAppointmentsRouter.get(
  '/availability',
  zValidator('query', availabilityQuerySchema),
  async (c) => {
    try {
      const { serviceId, date, durationMinutes, therapistId } = c.req.valid('query');
      const availability = await checkAvailability(serviceId, date, durationMinutes, therapistId);
      return c.json(availability, 200);
    } catch (error) {
      return handleError(error, c);
    }
  }
);

publicAppointmentsRouter.post('', zValidator('json', publicCreateAppointmentSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const appointment = await createPublicAppointment(data);
    return c.json(appointment, 201);
  } catch (error) {
    return handleError(error, c);
  }
});
