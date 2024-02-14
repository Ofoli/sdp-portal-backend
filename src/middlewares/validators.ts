import { Request, Response, NextFunction } from "express";
import { z } from "zod";
//schemas
import { userSchema } from "../schemas/user";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export const validateUserData = validateData(userSchema);
