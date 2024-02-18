import express from "express";
import { connectToMongoDB } from "./config/mongodb";
import { config } from "./config/config";
import router from "./routes";

const app = express();
const PORT = config.PORT || 3001;

app.use(express.json());
app.use(router);

connectToMongoDB(config.DB.CONN_RETRY_ATTEMPTS).then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }
});
