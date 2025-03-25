import type { NextFunction, Request, Response } from 'express';

export const asyncHandler = (
  fn: (
    arg0: Request | any,
    arg1: Response<any, Record<string, any>>,
    arg2: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
