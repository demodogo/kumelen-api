import { env } from '../../config/env.js';
import { EntityType, LogAction, type User } from '@prisma/client';
import type { LoginUserInput, RefreshTokenInput } from './types.js';
import { comparePassword, hashPassword } from '../../lib/auth.js';
import { SignJWT } from 'jose';
import { usersRepository } from '../users/repository.js';
import { sanitizeUser } from '../users/helpers.js';
import { authRepository } from './repository.js';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app-errors.js';
import { appLogsRepository } from '../app-logs/repository.js';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

function buildTokenPayload(user: User) {
  return {
    sub: user.id,
    username: user.username,
    role: user.role,
  };
}

async function generateAccessToken(user: User) {
  return await new SignJWT(buildTokenPayload(user))
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('15m') // Token de acceso corto
    .sign(JWT_SECRET);
}

async function generateRefreshToken(userId: string) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  await authRepository.createRefreshToken({
    token,
    userId,
    expiresAt,
  });

  return token;
}

export async function loginUser(data: LoginUserInput) {
  const user = await usersRepository.findByUsername(data.username);
  if (!user) {
    throw new UnauthorizedError();
  }
  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError();
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  await appLogsRepository.createLog({
    userId: user.id,
    action: LogAction.LOGIN,
    entity: EntityType.AUTH,
    entityId: user.id,
  });

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

export async function refreshAccessToken(data: RefreshTokenInput) {
  const storedToken = await authRepository.findRefreshToken(data.refreshToken);

  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    await authRepository.deleteRefreshToken(storedToken.id);
    throw new UnauthorizedError('Refresh token expired');
  }

  const user = await usersRepository.findById(storedToken.userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  await authRepository.deleteRefreshToken(storedToken.id);

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

export async function changePassword(id: string, password: string) {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  const hashedPassword = await hashPassword(password);
  await authRepository.changePassword(id, hashedPassword);
  appLogsRepository.createLog({
    userId: user.id,
    action: LogAction.UPDATE,
    entity: EntityType.USER,
    entityId: user.id,
    details: `Changed password for user ${user.id}`,
  });
  return { success: true };
}
