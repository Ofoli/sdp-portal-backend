import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import { createHashedPassword } from "../utils/misc";
import { UserData } from "../schemas/user";
import User from "../models/user";

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData: UserData = req.body;
    const hashedPassword = await createHashedPassword(validatedData.password);
    const createdUser = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    const user = await User.findById(createdUser._id).select("-password -__v");
    const userIndexes = await User.listIndexes();

    return res.json({ user, userIndexes });
  }
);
