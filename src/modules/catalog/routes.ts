import { Hono } from 'hono';
import { categoriesRouter } from './categories/routes.js';
import { productsRouter } from './products/routes.js';

export const catalogRouter = new Hono();

catalogRouter.route('/categories', categoriesRouter);
catalogRouter.route('/products', productsRouter);
