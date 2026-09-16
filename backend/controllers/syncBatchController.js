import { processBatchReports } from "../services/batchSyncService.js";
import { processSyncRecords } from "../services/syncService.js";

/**
 * Controller: Handles proof photo uploads (POST /api/sync/upload-proofs).
 * Validates multipart files and returns mappings of originalFilename -> fileUrl.
 */
export async function uploadProofs(req, res, next) {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "NO_FILES_PROVIDED",
        message: "No photo files provided. Please upload files under the 'photos' form field.",
      });
    }

    const uploaded = files.map((file) => ({
      originalFilename: file.originalname,
      fileUrl: `/uploads/proofs/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.status(201).json({
      success: true,
      message: `Successfully processed ${uploaded.length} proof image(s)`,
      count: uploaded.length,
      uploaded,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: Handles offline bulk batch synchronization (POST /api/sync/batch).
 * Ingests queued offline records from client IndexedDB with idempotency checks.
 */
export async function batchSync(req, res, next) {
  try {
    const reports = req.body?.reports;

    // Gracefully handle legacy payload format { records: [...] } if passed
    if (!reports && Array.isArray(req.body?.records)) {
      const legacyResult = await processSyncRecords(req.body.records);
      return res.json(legacyResult);
    }

    if (!Array.isArray(reports)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_BODY",
        message: "Request body must contain a 'reports' array.",
      });
    }

    const result = await processBatchReports(reports);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
