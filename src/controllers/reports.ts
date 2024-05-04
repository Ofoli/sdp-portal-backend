import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import Report from "../models/report";
import { STATUSES } from "../config/constants";
import type { SdpReportPayload } from "../types/report";

export const addSdpReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { report }: SdpReportPayload = req.body;
    await Report.create(report);
    return res.json({ status: STATUSES.SUCCESS });
  }
);
