import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

import schoolRoutes from "./routes/schoolRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import programs from "./routes/programs.js";
import assessments from "./routes/assessments.js";
import dashboard from "./routes/dashboard.js";
import sync from "./routes/sync.js";
import upload from "./routes/upload.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express
const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check Endpoints
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "YUWA Impact & Evaluation Portal API is running",
    status: "healthy",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Resource & Business Routes
app.use("/api/schools", schoolRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/programs", programs);
app.use("/api/assessments", assessments);
app.use("/api/sync", sync);
app.use("/api/upload", upload);
app.use("/api/photos/upload", upload);
app.use("/api", dashboard);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
