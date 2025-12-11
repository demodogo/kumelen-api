import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, refreshTokenSchema } from './schemas.js';
import { loginUser, refreshAccessToken } from './service.js';
import { AppError } from '../../shared/errors/app-errors.js';

export const authPublicRouter = new Hono();

authPublicRouter.post('/refresh', zValidator('json', refreshTokenSchema), async (c) => {
  const data = c.req.valid('json');
  try {
    const result = await refreshAccessToken(data);
    return c.json({ result }, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, code: error.code }, error.statusCode as any);
    }
    return c.json({ message: 'Internal server error' }, 500);
  }
});

authPublicRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const data = c.req.valid('json');
  try {
    const result = await loginUser(data);
    return c.json({ result }, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, code: error.code }, error.statusCode as any);
    }
    return c.json({ message: 'Internal server error' }, 500);
  }
});
