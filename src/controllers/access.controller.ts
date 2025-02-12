import type { NextFunction, Request, Response } from 'express';
import AccessService from '../services/access.service';

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
