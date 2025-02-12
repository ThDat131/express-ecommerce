import type { NextFunction, Request, Response } from 'express';
import { findById } from '../services/apiKey.service';
import type { ApiKey } from '../models/apiKey.model';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

interface CustomRequest extends Request {
  objKey: ApiKey;
}

export const apiKey = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objKey = objKey;

    next();
  } catch (err: any) {
    next(err);
  }
};

export const permission = (permission: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions)
      return res.status(403).json({
        message: 'Permission Denied',
      });

    const validPermissions = req.objKey.permissions.includes(permission);

    if (!validPermissions) {
      return res.status(403).json({
        message: 'Permission Denied',
      });
    }

    next();
  };
};
