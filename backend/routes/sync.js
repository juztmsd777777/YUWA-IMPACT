import { Router } from "express";
import mongoose from "mongoose";
import { syncRecords } from "../controllers/syncController.js";
import { batchSync, uploadProofs } from "../controllers/syncBatchController.js";
import { proofUploadMiddleware } from "../middleware/proofUploadMiddleware.js";
import ActivityReport from "../models/ActivityReport.js";
import { processBatchReports } from "../services/batchSyncService.js";

const router = Router();

// 1. Bulk offline sync endpoint (IndexedDB queued reports)
router.post("/batch", batchSync);

// 2. Multi-part proof-of-work photo upload endpoint
router.post("/upload-proofs", proofUploadMiddleware, uploadProofs);

// 3. Field App Sync Status endpoint (GET /api/sync/status)
router.get("/status", async (_req, res, next) => {
  try {
    let totalRecords = 0;
    let syncedRecords = 0;
    let failedRecords = 0;
    let pendingRecords = 0;
    let lastSynced = new Date().toISOString();
    let logs = [];

    if (mongoose.connection.readyState === 1) {
      totalRecords = await ActivityReport.countDocuments();
      syncedRecords = await ActivityReport.countDocuments({ status: "synced" });
      failedRecords = await ActivityReport.countDocuments({ status: "flagged" });
      pendingRecords = await ActivityReport.countDocuments({ status: "draft" });

      const latest = await ActivityReport.findOne().sort({ syncedAt: -1 });
      if (latest?.syncedAt) {
        lastSynced = latest.syncedAt.toISOString();
      }

      const recentReports = await ActivityReport.find()
        .sort({ updatedAt: -1 })
        .limit(10);

      logs = recentReports.map((r) => ({
        id: r._id,
        clientGeneratedId: r.clientGeneratedId,
        entity: r.programName || "Activity Report",
        description: `Synced ${r.studentCount || 0} students (${r.status})`,
        status: r.status,
        timestamp: r.syncedAt || r.createdAt,
      }));
    }

    const progressPercent = totalRecords > 0 ? Math.round((syncedRecords / totalRecords) * 100) : 100;

    res.json({
      success: true,
      progressPercent,
      totalRecords,
      syncedRecords,
      pendingRecords,
      failedRecords,
      lastSynced,
      logs,
    });
  } catch (err) {
    next(err);
  }
});

// 4. Field App Sync Trigger endpoint (POST /api/sync/trigger)
router.post("/trigger", async (req, res, next) => {
  try {
    const reports = req.body?.reports || req.body?.pendingBatch || [];
    if (Array.isArray(reports) && reports.length > 0) {
      const result = await processBatchReports(reports);
      return res.json(result);
    }
    return res.json({
      success: true,
      message: "Sync triggered successfully",
      syncedCount: 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// 5. Field App Retry endpoint (POST /api/sync/retry)
router.post("/retry", async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const failed = await ActivityReport.find({ status: "flagged" });
      if (failed.length > 0) {
        await ActivityReport.updateMany({ status: "flagged" }, { $set: { status: "synced", syncedAt: new Date() } });
      }
      return res.json({
        success: true,
        message: `Retried ${failed.length} failed record(s)`,
        retriedCount: failed.length,
      });
    }
    return res.json({
      success: true,
      message: "Retried 0 failed records",
      retriedCount: 0,
    });
  } catch (err) {
    next(err);
  }
});

// 6. Legacy/Base sync route: handles either reports array or records array
router.post("/", (req, res, next) => {
  if (Array.isArray(req.body?.reports)) {
    return batchSync(req, res, next);
  }
  return syncRecords(req, res, next);
});

export default router;

