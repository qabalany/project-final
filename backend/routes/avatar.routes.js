import express from 'express';
import { createSession } from '../controllers/avatar.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// The frontend makes a POST request here to start a LiveAvatar video stream.
// It is protected so only logged-in users with a valid JWT can access the AI features.
router.post('/create-session', protect, createSession);

export default router;
