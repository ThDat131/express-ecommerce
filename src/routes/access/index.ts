import express, { type RequestHandler } from 'express';
import accessController from '../../controllers/access.controller';

const accessRouter = express.Router();

accessRouter.post('/shop/sign-up', accessController.signUp as unknown as RequestHandler);

export default accessRouter;
