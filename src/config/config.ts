import dotenv from "dotenv";
import { MONGO_DB_HOST, ENV_FILE_PATH } from "./constants";

dotenv.config({ path: ENV_FILE_PATH });

const dbPort = process.env.DB_PORT;
const database = process.env.DB_NAME;
const databaseUri = `${MONGO_DB_HOST}:${dbPort}/${database}`;

const config = {
  PORT: process.env.PORT,
  DB: {
    URI: databaseUri,
    CONN_RETRY_INTERVAL: 1000,
    CONN_RETRY_ATTEMPTS: 5,
  },
  SDB: {
    USERNAME: process.env.SDB_USERNAME!,
    PASSWORD: process.env.SDB_PASSWORD!,
    HOST: process.env.SDB_HOST!,
    NAME: process.env.SDB_NAME!,
    PORT: 3306,
  },
  PASSWORD_SALT: process.env.PASSWORD_SALT!,
  JWT_TOKEN: { SECRET: process.env.JWT_TOKEN_SECRET!, EXPIRATION: "30m" },
};

export { config };
