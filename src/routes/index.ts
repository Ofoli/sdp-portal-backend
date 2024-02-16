import express, { NextFunction, Request, Response } from "express";
import { URLS } from "../config/constants";
import globalErrorHandler from "../middlewares/error-handler";
import AppError from "../utils/app-error";
import usersRouter from "./users";
import reportsRouter from "./reports";
import authRouter from "./auth";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

const testApp = (req: Request, res: Response) =>
  res.send({ status: true, message: "App is running!!!" });

const send404 = (req: Request, res: Response, next: NextFunction) =>
  next(
    new AppError(
      `${req.originalUrl} not found on this server`,
      StatusCodes.NOT_FOUND
    )
  );

router.get(URLS.base, testApp);
router.use(authRouter);
router.use(usersRouter);
router.use(reportsRouter);
router.all(URLS.notFound, send404);
router.use(globalErrorHandler);

export default router;
