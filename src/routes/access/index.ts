import express, { type RequestHandler } from 'express';
import accessController from '../../controllers/access.controller';
import { authentication } from '../../auth/authUtils';
import { asyncHandler } from '../../helpers/asyncHandler';
import { apiKey, permission } from '../../auth/checkAuth';

const accessRouter = express.Router();

accessRouter
  .post('/shop/sign-up', accessController.signUp as unknown as RequestHandler)
  .post('/shop/sign-in', accessController.signIn as unknown as RequestHandler);

// accessRouter.use(apiKey as RequestHandler);
// accessRouter.use(permission('000') as RequestHandler);
// accessRouter.use(authentication);

accessRouter.post('/shop/sign-out', asyncHandler(accessController.signOut));
accessRouter.post(
  '/shop/refresh-token',
  asyncHandler(accessController.handleRefreshToken)
);
accessRouter.post('/shop/test', () => console.log('test'));

export default accessRouter;
