import { Router } from "express";
import { emailVerification, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification } from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-email/:verificationToken").get(emailVerification);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)

export default router;