import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import profileRoutes from "./routes/profile.js";
import chatRoutes from "./routes/chat.js";
import resumeRoutes from "./routes/resume.js";

const result = dotenv.config();

console.log("dotenv result:", result);
console.log("API key:", process.env.GEMINI_API_KEY);


const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Career AI backend running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set.");
}
});
