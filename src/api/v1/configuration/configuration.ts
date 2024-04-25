// /* eslint-disable prettier/prettier */
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const CONFIG = {
  /** POSTGRESQL CONFIGURATION OPTIONS */
  POSTGRES: {
    POSTGRES_DEV: {
      type: 'postgres',
      host: process.env.POSTGRES_DEV_HOST as string,
      port: parseInt(process.env.POSTGRES_PORT as string, 10) || 5432,
      database: process.env.POSTGRES_DB as string,
      username: process.env.POSTGRES_USER as string,
      password: process.env.POSTGRES_PASSWORD as string,
    },
    POSTGRES_PROD: {
      type: 'postgres',
      host: process.env.POSTGRES_PROD_HOST as string,
      port: parseInt(process.env.POSTGRES_PORT as string, 10) || 5432,
      database: process.env.POSTGRES_DB as string,
      username: process.env.POSTGRES_USER as string,
      password: process.env.POSTGRES_PASSWORD as string,
    },
  } as Record<string, DataSourceOptions>,

  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  PORT: parseInt(process.env.PORT as string, 10) || 3001,
};

export default (): Record<string, any> => ({
  POSTGRES:
    CONFIG.NODE_ENV === 'development'
      ? CONFIG.POSTGRES.POSTGRES_DEV
      : CONFIG.POSTGRES.POSTGRES_PROD,
  NODE_ENV: CONFIG.NODE_ENV,
  PORT: CONFIG.PORT,
  CORS_OPTIONS: {
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: '*',
  },
});
