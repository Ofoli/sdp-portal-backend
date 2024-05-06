import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import { STATUSES } from "../config/constants";
import { findUserByEmail } from "../models/user";
import { createHashedPassword, generateAuthToken } from "../utils/auth";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import type { LoginData } from "../types/user";

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginData = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return next(new AppError("User Does Not Exist", StatusCodes.BAD_REQUEST));
    }

    const hashedPassword = await createHashedPassword(password);
    if (hashedPassword !== user.password) {
      return next(new AppError("Invalid Password", StatusCodes.BAD_REQUEST));
    }

    const { _id, isAdmin } = user;
    const token = generateAuthToken({ userId: _id, isAdmin });

    return res.json({
      status: STATUSES.SUCCESS,
      data: {
        user: user.getUserWithoutPassword(),
        token,
      },
    });
  }
);
