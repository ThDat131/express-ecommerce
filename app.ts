import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './src/dbs/init.mongodb';
import { checkOverload } from './src/helpers/check.connect';
import router from './src/routes';

await connectDB();

// checkOverload();

export const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('', router);
