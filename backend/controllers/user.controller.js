import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Create the new user.
        // The pre('save') hook in User.model.js will handle password hashing
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // 3. Generate a JWT token for the session
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: "30d",
            });

            // 4. Return success response
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// @desc    Authenticate a user and get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Locate user by email
        const user = await User.findOne({ email });

        // 2. Verify user exists and password is correct
        if (user && (await user.matchPassword(password))) {
            // 3. Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: "30d",
            });

            // 4. Return success response
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    // req.user is supplied by the auth middleware
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
