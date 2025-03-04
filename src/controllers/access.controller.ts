import type { NextFunction, Request, Response } from 'express';
import AccessService from '../services/access.service';
import { Created } from '../core/success.response';

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return new Created({
        message: 'Registered Ok!',
        metadata: await AccessService.signUp(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
