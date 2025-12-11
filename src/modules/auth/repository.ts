import { prisma } from '../../db/prisma.js';

export const authRepository = {
  changePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash: password },
    });
  },

  createRefreshToken(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({
      data,
    });
  },

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  },

  deleteRefreshToken(id: string) {
    return prisma.refreshToken.delete({
      where: { id },
    });
  },

  deleteUserRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },
};
