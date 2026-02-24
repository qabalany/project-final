import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";

// load environment variables so mongo URL stays secret
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

// Set up some basic middleware so my frontend can talk to my backend, and I can read JSON
app.use(cors());
app.use(express.json());

// connect to the MongoDB database using the URL from .env file
const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Yay! Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Uh oh, database connection failed: ${error.message}`);
    // Exit the process if the database connection fails, as the application cannot function without it.
    process.exit(1);
  }
};

// Call connection function
connectToDatabase();

// create a super simple route just to see if the server is actually working
app.get("/", (req, res) => {
  res.send("Hello World! My backend is running.");
});

// Mount the user routes
app.use("/api/users", userRoutes);

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is up and running on http://localhost:${port}`);
});
