import { z } from "zod";
import { userSchema, loginSchema } from "../schemas/user";
import { Document } from "mongoose";

export type UserData = z.infer<typeof userSchema>;
export type UserDocument = UserData & Document;
export type LoginData = z.infer<typeof loginSchema>;
