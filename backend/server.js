import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import avatarRoutes from "./routes/avatar.routes.js";
import appFeedbackRoutes from "./routes/appFeedback.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import connectToDatabase from "./config/db.js";
import config from "./config/index.js";

// Call connection function
connectToDatabase();

const port = config.port;
const app = express();

// Set up basic middleware for JSON and CORS
app.use(cors());
app.use(express.json());

// create a super simple route just to see if the server is actually working
app.get("/", (req, res) => {
  res.send("Hello World! My backend is running.");
});

// Mount the user routes
app.use("/api/users", userRoutes);

// Mount the AI avatar routes
app.use("/api/avatar", avatarRoutes);

// Mount the feedback routes
app.use("/api/app-feedback", appFeedbackRoutes); // Bug reports & general comments
app.use("/api/feedback", feedbackRoutes); // 7-step post-session wizard ratings

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is up and running on http://localhost:${port}`);
});
