import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "../config/config";
import type { JWTData } from "../types/user";

export const createHashedPassword = async (password: string) =>
  await bcrypt.hash(password, parseInt(config.PASSWORD_SALT));

export const checkPassword = async (password: string, hashedPassword: string) =>
  await bcrypt.compare(password, hashedPassword);

export const generateAuthToken = (data: JWTData) => {
  const SECRET: Secret = config.JWT_TOKEN.SECRET;
  const EXPIRATION: SignOptions["expiresIn"] = config.JWT_TOKEN.EXPIRATION;
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
