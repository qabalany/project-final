import mongoose from 'mongoose';

// The Feedback schema matches the 7-step wizard that students fill out after a session.
// This data is crucial for analyzing the effectiveness of the AI coaching.
const feedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        easeOfUse: {
            type: String,
            required: [true, 'Please rate the ease of use'],
        },
        websiteDesign: {
            // This is the star rating (1-5)
            type: Number,
            required: [true, 'Please provide a rating for the website design'],
            min: 1,
            max: 5,
        },
        sessionQuality: {
            type: String,
            required: [true, 'Please rate the session quality'],
        },
        usefulness: {
            type: String,
            required: [true, 'Please tell us how useful the session was'],
        },
        recommendation: {
            type: String,
            required: [true, 'Please tell us if you would recommend the platform'],
        },
        additionalComments: {
            type: String,
            default: '', // Optional field
        }
    },
    {
        // Automatically adds createdAt and updatedAt dates
        timestamps: true,
    }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
