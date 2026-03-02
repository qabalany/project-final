import client from "./client";

// Calls the backend to generate a fresh LiveAvatar session token and Context ID.
// Needs the selected avatar character ('ula' or 'tuwaiq') and the user's target profession.
export const createSession = async (avatarId, profession) => {
    const response = await client.post("/avatar/create-session", { avatarId, profession });
    return response.data;
};

// Starts the LiveAvatar streaming engine and returns LiveKit socket details.
export const startSession = async (sessionToken) => {
    const response = await client.post("/avatar/start-session", { sessionToken });
    return response.data;
};

// Forces the AI to interrupt itself and say the closing outro message.
export const sendOutro = async (sessionToken) => {
    const response = await client.post("/avatar/send-outro", { sessionToken });
    return response.data;
};

// Ends the WebRTC session gracefully to stop billing logic on the provider side.
// The backend will also log the total call duration to the database.
export const stopSession = async (sessionToken, userId, avatarId, durationInSeconds) => {
    const response = await client.post("/avatar/stop-session", {
        sessionToken,
        userId,
        avatarId,
        durationInSeconds,
    });
    return response.data;
};

// Sends the full session transcripts to OpenAI for CEFR level analysis and grammar corrections.
export const analyzeSession = async (transcripts) => {
    // Assuming backend extracts userId from JWT to tag the session with the new CEFR level
    const response = await client.post("/avatar/analyze-session", { transcripts });
    return response.data;
};

export default {
    createSession,
    startSession,
    sendOutro,
    stopSession,
    analyzeSession,
};
