import type { CreateProductInput, ProductListQuery, UpdateProductInput } from './types.js';
import { productsRepository } from './repository.js';
import { ConflictError, InternalServerError } from '../../../shared/errors/app-errors.js';

export async function listProducts(query: ProductListQuery) {
  const { page, pageSize, search, categoryId, isPublic } = query;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [items, total] = await productsRepository.findManyWithCount({
    search,
    categoryId,
    isPublic,
    skip,
    take,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

export async function getProductById(id: string) {
  return productsRepository.findById(id);
}

export async function getProductBySlug(slug: string) {
  return productsRepository.findBySlug(slug);
}

export async function createProduct(data: CreateProductInput) {
  const existingSlug = await productsRepository.findBySlug(data.slug);
  const existingName = await productsRepository.findByName(data.name);
  if (existingName || existingSlug) {
    throw new ConflictError('Producto');
  }
  const product = await productsRepository.create(data);
  if (!product) {
    throw new InternalServerError();
  }
  return product;
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  return productsRepository.update(id, data);
}

export async function deleteProduct(id: string): Promise<void> {
  await productsRepository.delete(id);
}
