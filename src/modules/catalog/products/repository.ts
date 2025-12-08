import type { CreateProductInput, FindManyArgs, UpdateProductInput } from './types.js';
import type { Product } from '@prisma/client';
import { buildWhere } from './helpers.js';
import { prisma } from '../../../db/prisma.js';
import { categoriesRepository } from '../categories/repository.js';
import { ConflictError } from '../../../shared/errors/app-errors.js';

export const productsRepository = {
  async findManyWithCount(args: FindManyArgs): Promise<[Product[], number]> {
    const { search, categoryId, isPublic, skip, take } = args;
    const where = buildWhere({ search, categoryId, isPublic });

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return [items as Product[], total];
  },

  findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  },

  async create(data: CreateProductInput) {
    let category;
    if (data.categoryId) {
      category = await categoriesRepository.findById(data.categoryId);
    } else {
      category = await categoriesRepository.findBySlug('default');
    }
    if (!category) {
      throw new ConflictError('Conflict with Category FK');
    }
    const withCategoryData = { ...data, categoryId: category.id };
    return prisma.product.create({
      data: withCategoryData,
    });
  },

  findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug } });
  },

  findByName(name: string) {
    return prisma.product.findUnique({ where: { name } });
  },

  update(id: string, data: UpdateProductInput & { updatedBy?: string | null }) {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.shortDesc !== undefined && { short_desc: data.shortDesc }),
        ...(data.longDesc !== undefined && { long_desc: data.longDesc }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.isPublished !== undefined && { is_public: data.isPublished }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
    });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};
