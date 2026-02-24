// Okay, this is where I define what an AI "Session" looks like in my database
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        // Every session belongs to a specific user, so I link it using their ObjectId
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This tells Mongoose to look in the User collection
        },
        // Which avatar did they talk to? (Ula or Tuwaiq)
        avatarId: {
            type: String,
            required: true,
        },
        // The ID given to us by the LiveAvatar API when the session started
        liveAvatarSessionId: {
            type: String,
            required: true,
        },
        // How long did they talk for? (in seconds)
        durationInSeconds: {
            type: Number,
            default: 0,
        },
        // What was the user's estimated English level based on the AI's analysis? (A1 to C2)
        cefrLevel: {
            type: String,
        },
        // I want to save the AI's feedback on their grammar and pronunciation so the user can review it later
        aiFeedback: {
            type: String,
        },
        // Did the session finish successfully, or did it disconnect?
        status: {
            type: String,
            enum: ['completed', 'interrupted', 'error'],
            default: 'completed',
        }
    },
    {
        // Mongoose automatically adds createdAt and updatedAt dates for me!
        // This is perfect because I can see exactly when the session happened just by looking at createdAt.
        timestamps: true,
    }
);

// Create the model and export it so I can save new sessions in my controllers
export default mongoose.model('Session', sessionSchema);
