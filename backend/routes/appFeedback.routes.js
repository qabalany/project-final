import express from 'express';
import { submitAppFeedback, getAllAppFeedback } from '../controllers/appFeedback.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Anyone who clicks the global "Report a Bug" icon sends their message here.
router.post('/', submitAppFeedback);

// The admin dashboard uses this endpoint to securely download all bug reports.
// Only users with an active Admin JWT can access this.
router.get('/', protect, admin, getAllAppFeedback);

export default router;
