import express from "express";
import { URLS } from "../config/constants";
import { loginUser } from "../controllers/auth";

const router = express.Router();

router.post(URLS.auth, loginUser);

export default router;
