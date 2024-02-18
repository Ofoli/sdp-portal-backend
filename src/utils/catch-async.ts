import { Request, Response, NextFunction } from "express";
import AppError from "./app-error";

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export default function catchAsync(handler: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
