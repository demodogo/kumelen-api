import { prisma } from '../../db/prisma.js';
import { hashPassword } from '../../lib/auth.js';
import type { CreateUserInput } from './types.js';

export const authRepository = {
  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  async createUser(data: CreateUserInput) {
    const hashedPassword = await hashPassword(data.password);
    return prisma.user.create({
      data: {
        username: data.username,
        passwordHash: hashedPassword,
        name: data.name,
        lastName: data.lastName ?? null,
        role: data.role,
      },
    });
  },
};
