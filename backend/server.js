import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler } from "./middleware/errorHandler.js";
import programs from "./routes/programs.js";
import schools from "./routes/schools.js";
import participants from "./routes/participants.js";
import activities from "./routes/activities.js";
import assessments from "./routes/assessments.js";
import dashboard from "./routes/dashboard.js";
import sync from "./routes/sync.js";
import upload from "./routes/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yuwa";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/programs", programs);
app.use("/api/schools", schools);
app.use("/api/participants", participants);
app.use("/api/activities", activities);
app.use("/api/assessments", assessments);
app.use("/api/sync", sync);
app.use("/api/upload", upload);
app.use("/api", dashboard);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected");
  } catch (err) {
    console.warn("MongoDB not connected:", err.message);
    console.warn("API will start anyway; CRUD routes need MongoDB.");
  }

  app.listen(PORT, () => {
    console.log(`YUWA API listening on http://localhost:${PORT}`);
  });
}

start();
