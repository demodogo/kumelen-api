import { z } from 'zod';
import { loginSchema } from './schemas.js';

export type LoginUserInput = z.infer<typeof loginSchema>;
