import dotenv from "dotenv";
import mongoose, { Error } from "mongoose";
import { MONGO_DB_HOST, DB_CONN_RETRY_ATTEMPTS } from "./constants";

dotenv.config();

const DB_CONN_RETRY_INTERVAL = 1000;
const dbPort = process.env.DB_PORT;
const database = process.env.DB_NAME;
const databaseUrl = `${MONGO_DB_HOST}:${dbPort}/${database}`;

export async function connectToMongoDB(retries: number) {
  console.log(
    `Attempting to connect to MongoDB (attempt ${
      retries + 1
    }/${DB_CONN_RETRY_ATTEMPTS})...`
  );

  try {
    await mongoose.connect(databaseUrl);
    console.log("Successfully connected to MongoDB");

    return true;
  } catch (err) {
    const error = err as Error;
    console.error("MongoDB connection error:", error.message);
    if (retries > 0) {
      console.log(`Retrying in ${DB_CONN_RETRY_INTERVAL / 1000} seconds...`);
      await new Promise((resolve) =>
        setTimeout(resolve, DB_CONN_RETRY_INTERVAL)
      );
      await connectToMongoDB(retries - 1);
    } else {
      console.error("Maximum retry attempts reached. Exiting...");
      process.exit(1);
    }
  }
}
