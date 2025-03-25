import type { NextFunction, Request, Response } from 'express';
import AccessService from '../services/access.service';
import { Created, Ok } from '../core/success.response';

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

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return new Ok({
        metadata: await AccessService.signIn(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return new Ok({
        message: 'Sign out success',
        metadata: await AccessService.signOut({ keyStore: req?.keyStore }),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return new Ok({
      message: 'Get token success',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

export default new AccessController();
