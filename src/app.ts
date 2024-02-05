import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => res.send({ status: true }));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
