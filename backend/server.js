import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is up and running on http://localhost:${port}`);
});
