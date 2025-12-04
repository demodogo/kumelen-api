import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { apiRouter } from './routes/index.js';
import { requestLogger } from './middleware/logger.js';
import { serve } from '@hono/node-server';

export const app = new Hono();

app.use('*', requestLogger);
app.use('*', cors());
app.use('*', secureHeaders());

app.get('/health', (c) => {
  return c.json({ status: 'ok', env: 'development' });
});

app.route('/api', apiRouter);

console.log('ENV keys:', Object.keys(process.env));
console.log('DATABASE_URL', process.env.DATABASE_URL);
console.log('JWT_KEY', process.env.JWT_KEY);

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
