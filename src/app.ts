import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectToMongoDB } from "./config/config";
import { DB_CONN_RETRY_ATTEMPTS } from "./config/constants";
import router from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(router);

connectToMongoDB(DB_CONN_RETRY_ATTEMPTS).then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }
});
