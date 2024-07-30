import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import type { JWTData } from "../types/user";

export const createHashedPassword = async (password: string) => {
  const salt = parseInt(config.PASSWORD_SALT!);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const generateAuthToken = (data: JWTData) => {
  const { SECRET, EXPIRATION } = config.JWT_TOKEN;
  const token = jwt.sign(data, SECRET, { expiresIn: EXPIRATION });
  return token;
};

export const verifyAuthToken = (token: string): JWTData | null => {
  let data = null;

  jwt.verify(token, config.JWT_TOKEN.SECRET, (err, jwtData) => {
    if (!err) data = jwtData;
  });

  return data;
};
