import { z } from 'zod';
import { Role } from '@prisma/client';

export const loginSchema = z.object({
  username: z.string().min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, 'Requerido'),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'sales', 'user']).default(Role.user),
});
