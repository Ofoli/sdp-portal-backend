import { model, Schema } from "mongoose";
import type { UserDocument } from "../types/user";

const UserRequiredString = { type: String, required: true };

const UserSchema = new Schema(
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

UserSchema.methods.getUserWithoutPassword = function (this) {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model<UserDocument>("User", UserSchema);

export default User;

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email: email });
  return user;
};
