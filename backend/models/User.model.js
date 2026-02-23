// Okay, this is where I define what a "User" looks like in my database
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // No two people can sign up with the same email
        },
        password: {
            type: String, // Even though we might use Google login later, local users need passwords
            default: '',
        },
        googleId: {
            type: String, // To link their Google account later
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user', // Everyone is a normal user by default
        },

        // --- Onboarding Data ---
        // I need to save the answers from the onboarding wizard so the AI knows how to talk to them
        onboardingCompleted: {
            type: Boolean,
            default: false,
        },
        motherTongue: {
            type: String,
        },
        targetLanguage: {
            type: String,
            default: 'English',
        },
        selectedAvatar: {
            type: String,
        },
        profession: {
            type: String, // The AI uses this to customize the conversation difficulty
        },
    },
    {
        timestamps: true, // Mongoose will automatically add createdAt and updatedAt dates for me!
    }
);

// I create the model and export it so I can use it in my routes later to find, create, or update users
export default mongoose.model('User', userSchema);
