import React, { createContext, useState, useEffect } from "react";
import authService from "../api/auth.service";
import client from "../api/client";

// Create the context so other components can access authentication data
export const AuthContext = createContext();

// This component wraps our app and provides the auth state to everything inside it
export const AuthProvider = ({ children }) => {
    // State to keep track of the logged-in user
    const [user, setUser] = useState(null);
    // State to indicate if we are currently loading auth data (like checking local storage on refresh)
    const [loading, setLoading] = useState(true);

    // Run this once when the application starts
    useEffect(() => {
        // Check if there is a saved token from a previous session
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            // Restore session
            setUser(JSON.parse(storedUser));
        }

        // Setup the Axios interceptor here as well to handle 401 Unauthorized errors globally
        const requestInterceptor = client.interceptors.response.use(
            (response) => response,
            (error) => {
                // If the server says our token is invalid or expired, log the user out
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        setLoading(false);

        // Cleanup interceptor when provider unmounts (good practice)
        return () => {
            client.interceptors.response.eject(requestInterceptor);
        };
    }, []);

    // Registration wrapper
    const register = async (userData) => {
        const data = await authService.register(userData);
        // Save to local storage for persistence across page reloads
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    // Login wrapper
    const login = async (userData) => {
        const data = await authService.login(userData);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    // Google Login wrapper
    const googleLogin = async (googleData) => {
        const data = await authService.googleLogin(googleData);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    // Clear session data to log out
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    // Refresh user profile data from the server
    const fetchProfile = async () => {
        try {
            const profile = await authService.getProfile();
            // Update the user state, merging existing data (like the token) with the fresh profile
            const updatedUser = { ...user, ...profile };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser)); // keep storage in sync
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    // Bundle everything we want to share with the rest of the app
    const contextValue = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        googleLogin,
        logout,
        fetchProfile
    };

    // Render the children (the rest of the app) and pass them the context value
    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
