import { model, Document, Schema } from "mongoose";
import { z } from "zod";

const userSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  email: z
    .string()
    .email()
    .refine((value) => value.endsWith("@nalosolutions.com"), {
      message: "Must be a NALO email",
    }),
  password: z.string().min(12),
  color: z.string(),
  isAdmin: z.boolean().default(false),
});

const UserRequiredString = { type: String, required: true };
const User = new Schema(
  {
    firstname: UserRequiredString,
    lastname: UserRequiredString,
    password: UserRequiredString,
    color: UserRequiredString,
    email: {
      ...UserRequiredString,
      lowercase: true,
      immutable: true,
      unique: true,
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

type UserData = z.infer<typeof userSchema>;

export default model<UserData>("User", User);
export { UserData, userSchema };
