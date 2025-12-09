import { prisma } from '../../../db/prisma.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './types.js';

export const categoriesRepository = {
  findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },

  findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  },

  findBySlugOrName(name: string, slug: string) {
    return prisma.category.findFirst({
      where: {
        OR: [{ slug }, { name }],
      },
    });
  },

  createCategory(data: CreateCategoryInput) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
      },
    });
  },

  findAll(includeOptions?: { services: boolean; products: boolean }) {
    return prisma.category.findMany({
      include: {
        services: includeOptions?.services ?? false,
        products: includeOptions?.services ?? false,
      },
      orderBy: { updatedAt: 'asc' },
    });
  },

  findById(id: string, includeOptions?: { services: boolean; products: boolean }) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        services: includeOptions?.services ?? false,
        products: includeOptions?.services ?? false,
      },
    });
  },

  update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
