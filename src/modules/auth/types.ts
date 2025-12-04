import { z } from 'zod';
import { loginSchema, type registerSchema } from './schemas.js';

export type CreateUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
