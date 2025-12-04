import 'dotenv/config';

console.log('ENV keys:', Object.keys(process.env));

/*

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('8080'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  console.error('ENV keys:', Object.keys(process.env));
  process.exit(1);
}

export const env = parsed.data;
*/
