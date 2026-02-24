import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Middleware to protect routes by verifying the JSON Web Token (JWT)
export const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract the token from the header (Format: "Bearer <token>")
            token = req.headers.authorization.split(" ")[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "fallback_secret"
            );

            // Fetch the user from the database and attach it to the request object (excluding the password)
            req.user = await User.findById(decoded.id).select("-password");

            // Move to the next middleware or route handler
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // If no token was found at all
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};
