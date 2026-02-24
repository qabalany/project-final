import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

// User Profile Route (Protected)
router.get("/profile", protect, getUserProfile);

export default router;
