import { Request, Response, NextFunction, json } from "express";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { fromZodError } from "zod-validation-error";
import { STATUSES } from "../config/constants";
import AppError from "../utils/app-error";

export default function globalErrorHandler(
  error: Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  //...code here
  if (error instanceof ZodError) {
    const errorMessages = fromZodError(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: STATUSES.FAILED, message: errorMessages });
  }

  if (error instanceof AppError) {
    const { status, statusCode, message } = error;
    return res.status(statusCode).json({ status, message });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ status: STATUSES.FAILED, message: "Internal Server Error" });
}
