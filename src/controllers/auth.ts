import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import { STATUSES } from "../config/constants";

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      status: STATUSES.SUCCESS,
      data: { id: 1, email: "test@gmail.com" },
    });
  }
);
