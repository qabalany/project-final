import express from "express";
import { registerUser, loginUser, getUserProfile, googleLogin } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

// User Google Login Route
router.post("/google-login", googleLogin);

// User Profile Route (Protected)
router.get("/profile", protect, getUserProfile);

export default router;
