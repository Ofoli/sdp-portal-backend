import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catch-async";
import { createHashedPassword } from "../utils/auth";
import User from "../models/user";
import { STATUSES } from "../config/constants";
import AppError from "../utils/app-error";

import type { UserData, RequestWithUser } from "../types/user";

export const createUser = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const validatedData: UserData = req.body;
    const hashedPassword = await createHashedPassword(validatedData.password);
    const createdUser = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    const user = await User.findById(createdUser._id).select("-password -__v");

    return res.json({ status: STATUSES.SUCCESS, user });
  }
);

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().select("-password -__v");
    return res.json({ status: STATUSES.SUCCESS, data: users });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const isValidId = ObjectId.isValid(id);
    if (!isValidId) {
      return next(new AppError("Invalid userid", StatusCodes.BAD_REQUEST));
    }

    const user = await User.findOne({ _id: id }).select("-password -__v");
    if (!user) {
      return next(new AppError("User Not Found", StatusCodes.NO_CONTENT));
    }

    return res.json({ status: STATUSES.SUCCESS, data: user });
  }
);
