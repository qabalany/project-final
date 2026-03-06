import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import avatarRoutes from "./routes/avatar.routes.js";
import appFeedbackRoutes from "./routes/appFeedback.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import connectToDatabase from "./config/db.js";
import config from "./config/index.js";
import User from "./models/User.model.js";

// Call connection function
connectToDatabase().then(async () => {
  // Seed demo and admin users if they don't exist
  const seeds = [
    { name: 'Demo User', email: 'test@logah.mvp', password: 'Logah2030', role: 'user', onboardingCompleted: false },
    { name: 'Admin', email: 'admin@logah.ai', password: 'AdminLogah2030!', role: 'admin', onboardingCompleted: true },
  ];
  for (const seed of seeds) {
    const exists = await User.findOne({ email: seed.email });
    if (!exists) {
      await User.create(seed);
      console.log(`✅ Seeded user: ${seed.email}`);
    }
  }
});

const port = config.port;
const app = express();

// Set up basic middleware for JSON and CORS
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
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
app.use("/api/analytics", analyticsRoutes); // Admin analytics aggregations

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is up and running on http://localhost:${port}`);
});

