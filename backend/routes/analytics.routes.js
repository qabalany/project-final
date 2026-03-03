import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { getAnalyticsSummary, getUserActivity } from '../controllers/analytics.controller.js';

const router = express.Router();

// Both endpoints are protected — admin only
router.get('/summary',       protect, admin, getAnalyticsSummary);
router.get('/user-activity', protect, admin, getUserActivity);

export default router;
