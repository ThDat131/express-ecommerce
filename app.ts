import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './src/dbs/init.mongodb';
import { checkOverload } from './src/helpers/check.connect';
import router from './src/routes';

class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
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

app.use((req, res, next) => {
  const error = new AppError('Not Found', 404);
  next(error);
});

app.use((error: any, req: any, res: any, next: any) => {
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: error?.message ?? 'Internal Server Error',
  });
});
