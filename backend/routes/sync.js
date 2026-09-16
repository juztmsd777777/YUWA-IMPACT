import { Router } from "express";
import { syncRecords } from "../controllers/syncController.js";
import { batchSync, uploadProofs } from "../controllers/syncBatchController.js";
import { proofUploadMiddleware } from "../middleware/proofUploadMiddleware.js";

const router = Router();

// 1. Bulk offline sync endpoint (IndexedDB queued reports)
router.post("/batch", batchSync);

// 2. Multi-part proof-of-work photo upload endpoint
router.post("/upload-proofs", proofUploadMiddleware, uploadProofs);

// 3. Legacy/Base sync route: handles either reports array or records array
router.post("/", (req, res, next) => {
  if (Array.isArray(req.body?.reports)) {
    return batchSync(req, res, next);
  }
  return syncRecords(req, res, next);
});

export default router;
