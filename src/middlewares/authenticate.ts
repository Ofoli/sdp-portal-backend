import { Response, NextFunction } from "express";
import { verifyAuthToken } from "../utils/auth";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/app-error";
import { RequestWithUser } from "../types/user";

export function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    const error = new AppError("Token Required", StatusCodes.UNAUTHORIZED);
    return next(error);
  }

  const data = verifyAuthToken(authorization);

  if (!data) {
    const error = new AppError(
      "Invalid or expired token",
      StatusCodes.UNAUTHORIZED
    );
    return next(error);
  }

  const { userId, isAdmin } = data;
  const id: string = req.params.id || req.body.userId;
  const isAuthorized = isAdmin || userId === id;

  if (!isAuthorized) {
    const error = new AppError("Forbidden", StatusCodes.FORBIDDEN);
    return next(error);
  }

  req.currentUser = data;
  return next();
}
