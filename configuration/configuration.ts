/* eslint-disable prettier/prettier */
export default (): Record<string, any> => ({
  POSTGRES: {
    POSTGRES_DEV: process.env.POSTGRES_DEV as string,
    POSTGRES_PROD: process.env.POSTGRES_PROD as string,
  },
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: process.env.PORT as string | null,
  CORS_OPTIONS: {
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: "*"
  },
});