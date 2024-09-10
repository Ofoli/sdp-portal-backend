import express from "express";
import cors from "cors";
import router from "./routes";
import { connectToMongoDB } from "./config/mongodb";
import { config } from "./config/config";
import { logger } from "./utils/logger";
import { CORS_OPTIONS } from "./config/constants";

const app = express();
const PORT = config.PORT || 3001;

app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(router);

connectToMongoDB(config.DB.CONN_RETRY_ATTEMPTS).then((connected) => {
  if (connected) {
    app.listen(PORT, () =>
      logger.info(`Server is running at http://localhost:${PORT}`)
    );
  }
});
