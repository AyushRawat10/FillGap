import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
import { generateReport } from "../controllers/interview.controller.js";

const router = Router();

router.route("/dashboard").post(verifyJWT, upload.single("resume"), generateReport)

export default router;
