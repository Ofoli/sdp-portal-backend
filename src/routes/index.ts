import express, { Request, Response } from "express";
import { URLS } from "../config/constants";
import usersRouter from "./users";
import reportsRouter from "./reports";

const router = express.Router();

const testApp = (req: Request, res: Response) =>
  res.send({ status: true, message: "App is running!!!" });

router.get(URLS.base, testApp);
router.use(usersRouter);
router.use(reportsRouter);

export default router;
