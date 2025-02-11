import { ENVIRONMENT } from './config.interface';

const dev = {
  app: {
    port: ENVIRONMENT.DEV_APP_PORT,
  },
  db: {
    host: ENVIRONMENT.DEV_DB_HOST,
    port: ENVIRONMENT.DEV_DB_PORT,
    name: ENVIRONMENT.DEV_DB_NAME,
  },
};

const prod = {
  app: {
    port: ENVIRONMENT.PROD_APP_PORT,
  },
  db: {
    host: ENVIRONMENT.PROD_DB_HOST,
    port: ENVIRONMENT.PROD_DB_PORT,
    name: ENVIRONMENT.PROD_DB_NAME,
  },
};

const config = { dev, prod };

const env = (ENVIRONMENT.NODE_ENV as 'dev' | 'prod') || 'dev';

export default config[env];
