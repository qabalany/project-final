import dotenv from "dotenv";

// Initialize environment variables immediately
dotenv.config();

// Export a single unified config object
const config = {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    googleClientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    // External APIs
    liveAvatarApiKey: process.env.LIVEAVATAR_API_KEY,
    liveAvatarTuwaiqId: process.env.LIVEAVATAR_AVATAR_ID_TUWAIQ,
    liveAvatarUlaId: process.env.LIVEAVATAR_AVATAR_ID_ULA,
    liveAvatarTuwaiqVoiceId: process.env.LIVEAVATAR_VOICE_ID_TUWAIQ,
    liveAvatarUlaVoiceId: process.env.LIVEAVATAR_VOICE_ID_ULA,
    openaiApiKey: process.env.OPENAI_API_KEY,
};

export default config;
