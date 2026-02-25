import client from "./client";

export const API_URL = 'http://localhost:8080/api';
// Extracts axios calls from components for reuse

// Send registration data to backend
export const register = async (userData) => {
    const response = await client.post("/users/register", userData);
    return response.data;
};

// Handle standard email/password login
export const login = async (userData) => {
    const response = await client.post("/users/login", userData);
    return response.data;
};

// Handle Google OAuth login
export const googleLogin = async (googleData) => {
    const response = await client.post("/users/google-login", googleData);
    return response.data;
};

// Get current user profile (JWT is auto-attached by interceptor)
export const getProfile = async () => {
    const response = await client.get("/users/profile");
    return response.data;
};

// Export all methods
export default {
    register,
    login,
    googleLogin,
    getProfile
};
