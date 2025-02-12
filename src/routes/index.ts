import express, { type RequestHandler } from 'express';
import accessRouter from './access';
import { apiKey, permission } from '../auth/checkAuth';

const router = express.Router();

router.use(apiKey as RequestHandler);
router.use(permission('000') as RequestHandler);

router.use('/v1/api', accessRouter);

export default router;
