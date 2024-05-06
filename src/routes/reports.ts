import express from "express";
import { URLS } from "../config/constants";
import { addSdpReport, fetchReport } from "../controllers/reports";
import { authenticate } from "../middlewares/authenticate";
import {
  validateSdpData,
  validateSdpQueryData,
} from "../middlewares/validators";

const router = express.Router();

router.post(URLS.report, authenticate, validateSdpData, addSdpReport);
router.get(
  `${URLS.report}/:id`,
  authenticate,
  validateSdpQueryData,
  fetchReport
);

export default router;
