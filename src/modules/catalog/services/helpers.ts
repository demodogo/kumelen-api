import type { FindManyArgs } from './types.js';
import { Prisma } from '@prisma/client';

export function buildWhere({
  search,
  categoryId,
  isPublic,
}: FindManyArgs): Prisma.ServiceWhereInput {
  const where: Prisma.ServiceWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDesc: { contains: search, mode: 'insensitive' } },
      { longDesc: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (typeof isPublic === 'boolean') {
    where.isPublished = isPublic;
  }

  return where;
}
