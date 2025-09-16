import { z } from "zod";
import dotenv from "dotenv";
import { ENV_FILE_PATH } from "./constants";

dotenv.config({ path: ENV_FILE_PATH });

const envSchema = z.object({
  PORT: z.number({ coerce: true }),
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string(),
  SDB_HOST: z.string(),
  SDB_NAME: z.string(),
  SDB_USER: z.string(),
  SDB_PASS: z.string(),
  SSH_HOST: z.string(),
  SSH_USER: z.string(),
  SSH_KEY_PATH: z.string(),
  PASSWORD_SALT: z.string(),
  JWT_TOKEN_SECRET: z.string(),
});

function parseEnv(processEnv: NodeJS.ProcessEnv) {
  try {
    const env = envSchema.parse(processEnv);
    const databaseUri = `${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
    return {
      PORT: env.PORT,
      DB: {
        URI: databaseUri,
        CONN_RETRY_INTERVAL: 1000,
        CONN_RETRY_ATTEMPTS: 5,
      },
      SDB: {
        USERNAME: env.SDB_USER,
        PASSWORD: env.SDB_PASS,
        HOST: env.SDB_HOST,
        NAME: env.SDB_NAME,
        PORT: 3306,
      },
      SSH: {
        HOST: env.SSH_HOST,
        USER: env.SSH_USER,
        PRIVATE_KEY_PATH: env.SSH_KEY_PATH!,
      },
      PASSWORD_SALT: env.PASSWORD_SALT,
      JWT_TOKEN: { SECRET: env.JWT_TOKEN_SECRET, EXPIRATION: "30m" },
    };
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export const config = parseEnv(process.env);
