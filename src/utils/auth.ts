import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const createHashedPassword = async (password: string) => {
  const salt = config.PASSWORD_SALT!;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const generateAuthToken = (userId: string) => {
  const { SECRET, EXPIRATION } = config.JWT_TOKEN;
  const token = jwt.sign({ userId }, SECRET, { expiresIn: EXPIRATION });
  return token;
};

export const verifyAuthToken = (token: string): { userId: string } | null => {
  let data = null;

  jwt.verify(token, config.JWT_TOKEN.SECRET, (err, jwtData) => {
    if (!err) data = jwtData;
  });

  return data;
};
