import { env } from '../../config/env.js';
import type { User } from '@prisma/client';
import type { CreateUserInput, LoginUserInput } from './types.js';
import { authRepository } from './repository.js';
import { AuthError } from './errors.js';
import { comparePassword } from '../../lib/auth.js';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

function buildTokenPayload(user: User) {
  return {
    sub: user.id,
    username: user.username,
    role: user.role,
  };
}

export async function registerUser(data: CreateUserInput) {
  const existing = await authRepository.findByUsername(data.username);
  if (existing) {
    throw new AuthError('EMAIL_TAKEN', 'Email already registered', 409);
  }
  const user = await authRepository.createUser(data);

  return sanitizeUser(user);
}

export async function loginUser(data: LoginUserInput) {
  const user = await authRepository.findByUsername(data.username);
  if (!user) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid username or password', 401);
  }
  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid username or password', 401);
  }

  const token = await new SignJWT(buildTokenPayload(user))
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return { token, user: sanitizeUser(user) };
}

function sanitizeUser(user: User) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}
