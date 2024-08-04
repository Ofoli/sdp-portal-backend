import mongoose, { Error } from "mongoose";
import { config } from "./config";
import { logger } from "../utils/logger";

export async function connectToMongoDB(retries: number) {
  const action = "mongodb.connect";
  logger.info({
    action,
    status: "connecting...",
    attempts: `${retries}/${config.DB.CONN_RETRY_ATTEMPTS}`,
  });

  try {
    await mongoose.connect(config.DB.URI);
    logger.info({ action, status: "connected" });

    return true;
  } catch (err) {
    const { message } = err as Error;
    logger.error({ action, status: "failed", err: message });

    if (retries > 0) {
      logger.info({
        action,
        status: "reconnecting...",
        msg: `Retrying in ${config.DB.CONN_RETRY_INTERVAL / 1000} seconds...`,
      });
      await new Promise((resolve) =>
        setTimeout(resolve, config.DB.CONN_RETRY_INTERVAL)
      );
      await connectToMongoDB(retries - 1);
    } else {
      logger.error({
        action,
        status: "falied",
        msg: "Maximum retry attempts reached. Exiting...",
      });
      process.exit(1);
    }
  }
}
