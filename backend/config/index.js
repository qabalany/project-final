import dotenv from "dotenv";

// Initialize environment variables immediately
dotenv.config();

// Export a single unified config object
const config = {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    googleClientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
};

export default config;
