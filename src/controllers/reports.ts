import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import Report from "../models/report";
import { STATUSES } from "../config/constants";
import { getPeriod } from "../utils/report";
import type { SdpReportPayload, SdpQueryParams } from "../types/report";

export const addSdpReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, report }: SdpReportPayload = req.body;
    await Report.create({ ...report, user });
    return res.json({ status: STATUSES.SUCCESS });
  }
);

export const fetchReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, date } = req.params as SdpQueryParams;

    const { startAt, endAt } = getPeriod(date);
    const condition =
      type === "daily" ? new Date(date) : { $gte: startAt, $lte: endAt };

    const reports = await Report.find({ revenueDate: condition });
    return res.json({ status: STATUSES.SUCCESS, data: reports });
  }
);
