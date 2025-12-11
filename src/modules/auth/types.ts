import { z } from 'zod';
import { loginSchema, refreshTokenSchema } from './schemas.js';

export type LoginUserInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
