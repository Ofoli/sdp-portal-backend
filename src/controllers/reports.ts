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

export const getRevenueDates = catchAsync(
  async (req: Request, res: Response) => {
    const month = req.params.month;
    const { startAt, endAt } = getPeriod(month);
    const dates = await Report.find(
      {
        revenueDate: { $gte: startAt, $lte: endAt },
      },
      { revenueDate: 1 }
    );

    return res.json({ status: STATUSES.SUCCESS, data: dates });
  }
);

export const getUserHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userActivities = await Report.find({})
      .populate({
        path: "user",
        select: "-__v",
      })
      .select({ revenueDate: 1, user: 1 })
      .sort({
        createdAt: -1,
      });

    const history = new Map();

    for (const activity of userActivities) {
      const id = activity._id.toString();
      if (!history.has(id)) history.set(id, activity);
    }

    return res.json({
      status: STATUSES.SUCCESS,
      data: Array.from(history.values()),
    });
  }
);
