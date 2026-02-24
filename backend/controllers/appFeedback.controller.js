import AppFeedback from '../models/AppFeedback.model.js';

// This endpoint allows any user (logged in or guest) to submit a bug report
// or general comment about the application through the global header icon.
export const submitAppFeedback = async (req, res) => {
    try {
        const { name, message, userId } = req.body;

        const newFeedback = await AppFeedback.create({
            name,
            message,
            // If the user isn't logged in, userId is undefined, so null is passed to the database
            userId: userId || null
        });

        res.status(201).json({
            success: true,
            data: newFeedback,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        console.error('Error saving app feedback:', error);
        res.status(500).json({ success: false, message: 'Failed to save feedback', details: error.message });
    }
};

// This endpoint powers the admin dashboard's bug report table.
// It returns a list of all bug reports, starting with the most recent.
export const getAllAppFeedback = async (req, res) => {
    try {
        const feedbacks = await AppFeedback.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (error) {
        console.error('Error fetching app feedbacks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bug reports', details: error.message });
    }
};
