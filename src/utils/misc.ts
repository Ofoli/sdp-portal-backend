import bcrypt from "bcryptjs";
import { config } from "../config/config";

export const createHashedPassword = async (password: string) => {
  const salt = config.PASSWORD_SALT!;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
