import { Router } from "express";
import { emailVerification, getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/verify-email/:verificationToken").get(emailVerification);

export default router;