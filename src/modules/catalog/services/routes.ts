import { Hono } from 'hono';
import { authMiddleware } from '../../../middleware/auth.js';
import { hasRole } from '../../../middleware/role-guard.js';
import { Role } from '@prisma/client';
import { zValidator } from '@hono/zod-validator';
import { createServiceSchema, serviceListQuerySchema, updateServiceSchema } from './schema.js';
import {
  createService,
  deleteService,
  getServiceById,
  listServices,
  updateService,
} from './service.js';
import { AppError } from '../../../shared/errors/app-errors.js';

export const servicesRouter = new Hono();

servicesRouter.post(
  '',
  authMiddleware,
  hasRole([Role.admin]),
  zValidator('json', createServiceSchema),
  async (c) => {
    const data = c.req.valid('json');
    try {
      const authed = c.get('user');
      const service = await createService(authed.sub, data);
      return c.json({ service }, 201);
    } catch (error) {
      if (error instanceof AppError) {
        return c.json({ message: error.message, code: error.code }, error.statusCode as any);
      }
      return c.json({ message: 'Internal server error' }, 500);
    }
  }
);

servicesRouter.get('', authMiddleware, zValidator('query', serviceListQuerySchema), async (c) => {
  try {
    const query = c.req.valid('query');
    const services = await listServices(query);
    return c.json({ services }, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, code: error.code }, error.statusCode as any);
    }
    return c.json({ message: 'Internal server error' }, 500);
  }
});

servicesRouter.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const service = await getServiceById(id);
    return c.json({ service }, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, code: error.code }, error.statusCode as any);
    }
    return c.json({ message: 'Internal server error ' }, 500);
  }
});

servicesRouter.patch(
  '/:id',
  authMiddleware,
  hasRole([Role.admin]),
  zValidator('json', updateServiceSchema),
  async (c) => {
    try {
      const id = c.req.param('id');
      const data = c.req.valid('json');
      const authed = c.get('user');
      const service = await updateService(authed.sub, id, data);
      return c.json({ service }, 200);
    } catch (error) {
      if (error instanceof AppError) {
        return c.json({ message: error.message, code: error.code }, error.statusCode as any);
      }
      return c.json({ message: 'Internal server error' }, 500);
    }
  }
);

servicesRouter.delete('/:id', authMiddleware, hasRole([Role.admin]), async (c) => {
  try {
    const id = c.req.param('id');
    const authed = c.get('user');
    const result = await deleteService(authed.sub, id);
    return c.json({ result }, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, code: error.code }, error.statusCode as any);
    }
    return c.json({ message: 'Internal server error' }, 500);
  }
});
