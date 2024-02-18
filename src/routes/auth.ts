import express from "express";
import { URLS } from "../config/constants";
import { validateLoginData } from "../middlewares/validators";
import { loginUser } from "../controllers/auth";

const router = express.Router();

router.post(URLS.auth, validateLoginData, loginUser);

export default router;
