import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectToMongoDB } from "./config";
import { DB_CONN_RETRY_ATTEMPTS } from "./constants";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) =>
  res.send({ status: true, message: "App is running now" })
);

connectToMongoDB(DB_CONN_RETRY_ATTEMPTS).then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }
});
