import type { FindManyArgs } from './types.js';
import { Prisma } from '@prisma/client';

export function buildWhere({
  search,
  categoryId,
  isPublic,
}: FindManyArgs): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDesc: { contains: search, mode: 'insensitive' } },
      { longDesc: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
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
