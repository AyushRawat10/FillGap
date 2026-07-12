import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
import { generateReport, getAllReports, getReportById } from "../controllers/interview.controller.js";

const router = Router();

router.route("/").post(verifyJWT, upload.single("resume"), generateReport)
router.route("/report/:interviewReportId").get(verifyJWT, getReportById)
router.route("/report").get(verifyJWT, getAllReports)

export default router;
