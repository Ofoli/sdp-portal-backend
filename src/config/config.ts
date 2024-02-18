import dotenv from "dotenv";
import { MONGO_DB_HOST } from "./constants";

dotenv.config();

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
  PASSWORD_SALT: process.env.PASSWORD_SALT,
};

export { config };
