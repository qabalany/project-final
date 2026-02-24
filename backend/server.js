import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.model.js";

// First thing I need to do is load my environment variables so my mongo URL stays secret
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

// Set up some basic middleware so my frontend can talk to my backend, and I can read JSON
app.use(cors());
app.use(express.json());

// Okay, now let's try to connect to the MongoDB database using the URL from my .env file
const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Yay! Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Uh oh, database connection failed: ${error.message}`);
    // I should probably crash the app if the database doesn't work, since the whole app relies on it
    process.exit(1);
  }
};

// Call my connection function
connectToDatabase();

// Let's create a super simple route just to see if the server is actually working
app.get("/", (req, res) => {
  res.send("Hello World! My backend is running.");
});

// --- User Registration Endpoint ---
// I'm dumping this right into server.js for now. I'll clean it up and move it to a routes folder later.
app.post("/api/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if the user already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If they exist, send a 400 Bad Request error
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create the new user. 
    // Mongoose will automatically run my pre('save') hook in User.model.js and hash this password!
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // 3. Generate a JWT ticket so they are automatically logged in after registering
      // (Using a default secret if I forget to add one to my .env later)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: "30d",
      });

      // 4. Send back the success response with the user data and token
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
});

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is up and running on http://localhost:${port}`);
});
