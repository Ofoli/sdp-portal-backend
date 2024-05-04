import express from "express";
import { URLS } from "../config/constants";
import { addSdpReport } from "../controllers/reports";
import { authenticate } from "../middlewares/authenticate";
import { validateSdpData } from "../middlewares/validators";

const router = express.Router();

router.post(URLS.report, authenticate, validateSdpData, addSdpReport);

export default router;
