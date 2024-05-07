import express from "express";
import { URLS } from "../config/constants";
import {
  addSdpReport,
  fetchReport,
  getRevenueDates,
  getUserHistory,
} from "../controllers/reports";
import { authenticate } from "../middlewares/authenticate";
import {
  validateSdpData,
  validateSdpQueryData,
} from "../middlewares/validators";

const router = express.Router();

router.post(URLS.report.add, authenticate, validateSdpData, addSdpReport);
router.get(URLS.report.query, authenticate, validateSdpQueryData, fetchReport);
router.get(URLS.report.recents, authenticate, getRevenueDates);
router.get(URLS.report.history, authenticate, getUserHistory);

export default router;
