import { Hono } from 'hono';

export const apiRouter = new Hono();

apiRouter.get('/', (c) => {
    return c.json({
        name: 'Kumelen API',
        version: '0.1.0'
    });
});

