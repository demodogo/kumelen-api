import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from './schemas.js';
import { loginUser, registerUser } from './service.js';

export const authRouter = new Hono();

authRouter.post('/register', zValidator('json', registerSchema), async (c) => {
  const data = c.req.valid('json');

  try {
    const user = await registerUser(data);
    return c.json({ user }, 201);
  } catch (error) {
    return c.json({ message: 'Internal server error' }, 500);
  }
});

authRouter.post('login', zValidator('json', loginSchema), async (c) => {
  const data = c.req.valid('json');
  try {
    const result = await loginUser(data);
    return c.json({ result }, 200);
  } catch {
    return c.json({ message: 'Internal server error' }, 500);
  }
});
