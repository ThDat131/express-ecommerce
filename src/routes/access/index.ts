import express from 'express';
import accessController from '../../controllers/access.controller';

const accessRouter = express.Router();

accessRouter.post('/shop/sign-up', accessController.signUp);

export default accessRouter;
