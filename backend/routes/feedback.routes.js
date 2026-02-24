import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedback.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// When a user completes the 7-step feedback form, the frontend sends the data here to be saved.
router.post('/', submitFeedback);

// The admin dashboard uses this endpoint to securely download all the feedback data.
// Only users with an active Admin JWT can access this.
router.get('/', protect, admin, getAllFeedback);

export default router;
