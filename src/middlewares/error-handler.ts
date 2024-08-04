import AppError from "../utils/app-error";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { fromZodError } from "zod-validation-error";
import { STATUSES } from "../config/constants";
import { logger } from "../utils/logger";
import type { NextFunction, Request, Response } from "express";

type MongooseError = Error & {
  code?: number;
  keyValue: Record<string, unknown>;
};

export default function globalErrorHandler(
  error: Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const url = req.originalUrl;
  if (error instanceof ZodError) {
    const { details: message } = fromZodError(error);
    logger.error({ type: "zodError", url, err: message });

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: STATUSES.FAILED, message });
  }

  if (error.name == "MongoServerError") {
    const err = error as MongooseError;
    error = formatMongooseError(err);
  }

  if (error instanceof AppError) {
    const { status, statusCode, message } = error;
    logger.error({ type: "appError", url, err: message });
    return res.status(statusCode).json({ status, message });
  }

  logger.error({ type: "SystemError", url, err: error });
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ status: STATUSES.FAILED, message: "Internal Server Error" });
}

function formatMongooseError(error: MongooseError) {
  const code = error.code ?? 0;
  const keyValue = error.keyValue ?? {};

  let message = "An Error Occurred";

  if (code === 11000 || code === 11001) {
    message = `Duplicate key error ${JSON.stringify(keyValue)}`;
    return new AppError(message, StatusCodes.BAD_REQUEST);
  }

  return new Error(message);
}
