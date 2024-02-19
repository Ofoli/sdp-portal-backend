import express from "express";
import { URLS } from "../config/constants";
import { createUser, getUsers } from "../controllers/users";
import { validateUserData } from "../middlewares/validators";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post(URLS.users, validateUserData, createUser);
router.get(URLS.users, authenticate, getUsers);

export default router;
