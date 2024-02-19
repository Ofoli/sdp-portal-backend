import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import { createHashedPassword } from "../utils/auth";
import User from "../models/user";
import type { UserData, RequestWithUser } from "../types/user";
import { STATUSES } from "../config/constants";

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
