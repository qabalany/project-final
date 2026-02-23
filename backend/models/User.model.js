// Okay, this is where I define what a "User" looks like in my database
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// --- Password Protection Magic ---

// 1. Before saving a user to the database, I need to scramble their password
userSchema.pre('save', async function (next) {
    // If the user isn't updating their password, skip this step so I don't double-hash it!
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a random "salt" (extra characters) to make the hash even stronger
    const salt = await bcrypt.genSalt(10);

    // Replace the plain text password with the scrambled hash
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 2. Later, when the user logs in, I need a way to check if their entered password matches the scrambled one in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    // bcrypt handles the math to see if "password123" matches the crazy string in the database
    return await bcrypt.compare(enteredPassword, this.password);
};

// I create the model and export it so I can use it in my routes later to find, create, or update users
export default mongoose.model('User', userSchema);
