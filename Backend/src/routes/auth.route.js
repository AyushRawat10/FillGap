import { Router } from "express";
import {
    emailVerification,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgotPassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-email/:verificationToken").get(emailVerification);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordRequest);
router.route("/reset-password/:resetToken").get(resetForgotPassword);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router
    .route("/resend-email-verification")
    .post(verifyJWT, resendEmailVerification);

export default router;
