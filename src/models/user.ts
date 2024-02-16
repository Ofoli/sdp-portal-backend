import { model, Document, Schema } from "mongoose";
import { UserData } from "../schemas/user";

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

export default model<UserData & Document>("User", User);
