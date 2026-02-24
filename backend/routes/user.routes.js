import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

export default router;
