import express from "express";
import { registerUser, loginUser, getUserProfile, googleLogin, googleOAuthRedirect, googleOAuthCallback } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

// User Google Login Route (client-side credential verification)
router.post("/google-login", googleLogin);

// Google OAuth server-side flow
router.get("/google", googleOAuthRedirect);
router.get("/google/callback", googleOAuthCallback);

// User Profile Route (Protected)
router.get("/profile", protect, getUserProfile);

export default router;
