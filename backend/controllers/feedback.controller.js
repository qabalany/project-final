import Feedback from '../models/Feedback.model.js';

// This endpoint receives the data from the 7-step feedback wizard after a session ends.
// It is kept public because occasionally guest users or demo sessions might submit feedback.
export const submitFeedback = async (req, res) => {
    try {
        const {
            name,
            easeOfUse,
            websiteDesign,
            sessionQuality,
            usefulness,
            recommendation,
            additionalComments
        } = req.body;

        const newFeedback = await Feedback.create({
            name,
            easeOfUse,
            websiteDesign,
            sessionQuality,
            usefulness,
            recommendation,
            additionalComments
        });

        res.status(201).json({
            success: true,
            data: newFeedback,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ success: false, message: 'Failed to save feedback', details: error.message });
    }
};

// This endpoint is strictly used by the admin dashboard.
// It fetches every single piece of feedback ever submitted, sorting the newest ones to the top.
export const getAllFeedback = async (req, res) => {
    try {
        // Fetch all feedback sorted by newest first
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', details: error.message });
    }
};
