import express, { Request, Response } from "express";
import { URLS } from "../config/constants";

const router = express.Router();

const testReports = (req: Request, res: Response) =>
  res.send({ status: true, reports: [] });

router.get(URLS.report, testReports);

export default router;
