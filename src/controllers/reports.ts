import catchAsync from "../utils/catch-async";
import Report from "../models/report";
import AppError from "../utils/app-error";
import { shortcodeDb } from "../utils/sdb";
import { STATUSES } from "../config/constants";
import { getPeriod } from "../utils/report";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import type { SdpReportPayload, SdpQueryParams } from "../types/report";

export const addSdpReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, report }: SdpReportPayload = req.body;
    const sampleRevenueDate = new Date(report[0].revenueDate);

    const sdp = await Report.findOne({ revenueDate: sampleRevenueDate });
    if (sdp) {
      const error = new AppError("Duplicate Report", StatusCodes.CONFLICT);
      return next(error);
    }

    const sdbUploadStatus = await shortcodeDb.uploadSdp(report);
    if (!sdbUploadStatus) {
      const error = new AppError(
        "Report upload failed",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return next(error);
    }

    const userReport = report.map((sdp) => ({
      ...sdp,
      user,
      revenueDate: new Date(sdp.revenueDate),
    }));
    await Report.create(userReport);

    return res.json({ status: STATUSES.SUCCESS });
  }
);

export const fetchReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, date } = req.query as SdpQueryParams;

    const { startAt, endAt } = getPeriod(date);
    const condition =
      type === "daily" ? new Date(date) : { $gte: startAt, $lte: endAt };

    const reports = await Report.find({ revenueDate: condition }).select(
      "-user -__v"
    );
    return res.json({ status: STATUSES.SUCCESS, data: reports });
  }
);

export const getRevenueDates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const month = req.query.month;

    if (!month) {
      const error = new AppError("Invalid month", StatusCodes.BAD_REQUEST);
      return next(error);
    }
    const { startAt, endAt } = getPeriod(month as string);
    const dates = await Report.find(
      {
        revenueDate: { $gte: startAt, $lte: endAt },
      },
      { revenueDate: 1 }
    );

    const monthlyRevenueDates = dates.map((date) => date.revenueDate);
    return res.json({ status: STATUSES.SUCCESS, data: monthlyRevenueDates });
  }
);

export const getUserHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userActivities = await Report.find({})
      .populate({
        path: "user",
        select: "firstname lastname color",
      })
      .select({ createdAt: 1, user: 1 })
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
