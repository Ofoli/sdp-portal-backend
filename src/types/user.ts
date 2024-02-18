import { z } from "zod";
import { userSchema, loginSchema } from "../schemas/user";
import { Document } from "mongoose";

export type UserData = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export interface UserDocument extends UserData, Document {
  getUserWithoutPassword: () => Omit<this, "password">;
}
