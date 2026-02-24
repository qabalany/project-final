import express from 'express';
import { createSession, stopSession } from '../controllers/avatar.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// The frontend makes a POST request here to start a LiveAvatar video stream.
// It is protected so only logged-in users with a valid JWT can access the AI features.
router.post('/create-session', protect, createSession);

// The frontend makes a POST request here when the user clicks 'End Call'
// This forcefully stops the LiveAvatar billing cycle for this session and saves the duration.
router.post('/stop-session', protect, stopSession);

export default router;
