import express from "express";
import { URLS } from "../config/constants";
import { createUser } from "../controllers/users";
import { validateUserData } from "../middlewares/validators";

const router = express.Router();

router.post(URLS.users, validateUserData, createUser);

export default router;
