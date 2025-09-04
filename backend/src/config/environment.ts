import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3001'),
  
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('solar_store_dev'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  
  // API
  API_PREFIX: z.string().default('/api/v1'),
  
  // Security
  HELMET_ENABLED: z.string().transform(val => val === 'true').default('true'),
  
  // Swagger
  SWAGGER_ENABLED: z.string().transform(val => val === 'true').default('true'),
  SWAGGER_TITLE: z.string().default('Solar Store API'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  SWAGGER_DESCRIPTION: z.string().default('API for Solar Equipment Store with Financing')
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', envParse.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = envParse.data;

export const config = {
  app: {
    env: env.NODE_ENV,
    port: parseInt(env.PORT),
    apiPrefix: env.API_PREFIX,
    isDevelopment: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',
    isProduction: env.NODE_ENV === 'production'
  },
  
  database: {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  },
  
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
    max: parseInt(env.RATE_LIMIT_MAX_REQUESTS)
  },
  
  cors: {
    origin: env.CORS_ORIGIN
  },
  
  logging: {
    level: env.LOG_LEVEL
  },
  
  security: {
    helmetEnabled: env.HELMET_ENABLED
  },
  
  swagger: {
    enabled: env.SWAGGER_ENABLED,
    title: env.SWAGGER_TITLE,
    version: env.SWAGGER_VERSION,
    description: env.SWAGGER_DESCRIPTION
  }
};

export default config;

