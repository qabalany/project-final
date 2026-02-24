import mongoose from 'mongoose';

// The AppFeedback schema is a simpler model used for the "Report a Bug" 
// or "General Feedback" form that appears globally in the application headers.
const appFeedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
        },
        // We optionally link it to a User. If a guest submits a bug report, this remains null.
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const AppFeedback = mongoose.model('AppFeedback', appFeedbackSchema);

export default AppFeedback;
