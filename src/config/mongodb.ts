import mongoose, { Error } from "mongoose";
import { config } from "./config";

export async function connectToMongoDB(retries: number) {
  console.log(
    `Attempting to connect to MongoDB (attempt ${retries + 1}/${
      config.DB.CONN_RETRY_ATTEMPTS
    })...`
  );

  try {
    await mongoose.connect(config.DB.URI);
    console.log("Successfully connected to MongoDB");

    return true;
  } catch (err) {
    const error = err as Error;
    console.error("MongoDB connection error:", error.message);
    if (retries > 0) {
      console.log(
        `Retrying in ${config.DB.CONN_RETRY_INTERVAL / 1000} seconds...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, config.DB.CONN_RETRY_INTERVAL)
      );
      await connectToMongoDB(retries - 1);
    } else {
      console.error("Maximum retry attempts reached. Exiting...");
      process.exit(1);
    }
  }
}
