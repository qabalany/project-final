import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
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

// Start listening for requests
app.listen(port, () => {
  console.log(`Server is up and running on http://localhost:${port}`);
});
