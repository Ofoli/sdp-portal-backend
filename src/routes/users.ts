import express, { Request, Response } from "express";
import { URLS } from "../config/constants";

const router = express.Router();

const testUsers = (req: Request, res: Response) =>
  res.send({ status: true, users: [] });

router.get(URLS.users, testUsers);

export default router;
