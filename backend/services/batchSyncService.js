import mongoose from "mongoose";
import ActivityReport from "../models/ActivityReport.js";
import Activity from "../models/Activity.js";
import Program from "../models/Program.js";

/**
 * Validates a single offline report payload before database ingestion.
 */
function validateReport(report) {
  const errors = [];

  if (!report.clientGeneratedId || typeof report.clientGeneratedId !== "string") {
    errors.push("clientGeneratedId is required and must be a string");
  }

  if (!report.programName || typeof report.programName !== "string") {
    errors.push("programName is required and must be a string");
  }

  if (!report.clientCreatedAt) {
    errors.push("clientCreatedAt is required");
  } else {
    const parsedDate = new Date(report.clientCreatedAt);
    if (isNaN(parsedDate.getTime())) {
      errors.push("clientCreatedAt must be a valid ISO Date string");
    }
  }

  if (report.studentCount !== undefined && (typeof report.studentCount !== "number" || report.studentCount < 0)) {
    errors.push("studentCount must be a non-negative number");
  }

  if (report.photoUrls !== undefined && !Array.isArray(report.photoUrls)) {
    errors.push("photoUrls must be an array of string URLs");
  }

  return errors;
}

/**
 * Syncs a batch of queued offline activity reports.
 * Guarantees idempotency via unique `clientGeneratedId`.
 * 
 * @param {Array<Object>} reports - Array of offline reports from IndexedDB
 * @returns {Promise<Object>} Summary and per-record result status
 */
export async function processBatchReports(reports = []) {
  if (!Array.isArray(reports)) {
    throw new Error("Invalid payload: 'reports' must be an array");
  }

  const results = [];
  const failed = [];
  let syncedCount = 0;
  let duplicateCount = 0;
  let updatedCount = 0;

  // Cache programs map for dual-write lookups
  let programMap = new Map();
  try {
    const progs = await Program.find();
    progs.forEach((p) => {
      programMap.set(p.name.toLowerCase().trim(), p._id);
    });
  } catch (_e) {
    // If Program collection query fails or is empty, proceed without crashing
  }

  for (const report of reports) {
    const clientGeneratedId = report?.clientGeneratedId;

    // Validate payload
    const validationErrors = validateReport(report || {});
    if (validationErrors.length > 0) {
      failed.push({
        clientGeneratedId: clientGeneratedId || null,
        status: "validation_failed",
        errors: validationErrors,
      });
      continue;
    }

    try {
      const clientCreatedAt = new Date(report.clientCreatedAt);
      const studentCount = Number(report.studentCount) || 0;
      const photoUrls = Array.isArray(report.photoUrls) ? report.photoUrls : [];
      const activityDetails = report.activityDetails || {};
      const schoolId = report.schoolId || null;
      const programName = report.programName.trim();
      const status = report.status && ["synced", "draft", "flagged"].includes(report.status)
        ? report.status
        : "synced";

      // 1. Check existing record for idempotency / conflict handling
      const existing = await ActivityReport.findOne({ clientGeneratedId });

      if (!existing) {
        // Record is new -> Create
        const newReport = await ActivityReport.create({
          clientGeneratedId,
          schoolId,
          programName,
          studentCount,
          activityDetails,
          photoUrls,
          status,
          clientCreatedAt,
          syncedAt: new Date(),
        });

        syncedCount++;
        results.push({
          clientGeneratedId,
          status: "synced",
          id: newReport._id,
          syncedAt: newReport.syncedAt,
        });

        // Mirror to legacy Activity collection for seamless dashboard compatibility
        await mirrorToLegacyActivity({
          clientGeneratedId,
          schoolId,
          programName,
          studentCount,
          activityDetails,
          photoUrls,
          clientCreatedAt,
          programMap,
        });
      } else {
        // Record already exists -> Idempotency / Conflict resolution
        const existingClientTime = new Date(existing.clientCreatedAt).getTime();
        const incomingClientTime = clientCreatedAt.getTime();

        // Check if incoming report is newer or has updated contents
        const incomingHasUpdates =
          incomingClientTime > existingClientTime ||
          photoUrls.length !== existing.photoUrls.length ||
          JSON.stringify(activityDetails) !== JSON.stringify(existing.activityDetails) ||
          studentCount !== existing.studentCount ||
          (existing.status === "draft" && status === "synced");

        if (incomingHasUpdates) {
          existing.schoolId = schoolId || existing.schoolId;
          existing.programName = programName || existing.programName;
          existing.studentCount = studentCount;
          existing.activityDetails = activityDetails;
          existing.photoUrls = photoUrls;
          existing.status = status;
          existing.clientCreatedAt = clientCreatedAt;
          existing.syncedAt = new Date();

          await existing.save();
          updatedCount++;
          results.push({
            clientGeneratedId,
            status: "updated",
            id: existing._id,
            syncedAt: existing.syncedAt,
          });

          await mirrorToLegacyActivity({
            clientGeneratedId,
            schoolId,
            programName,
            studentCount,
            activityDetails,
            photoUrls,
            clientCreatedAt,
            programMap,
          });
        } else {
          // Record is identical or older; safely acknowledge without duplicate insertion
          duplicateCount++;
          results.push({
            clientGeneratedId,
            status: "duplicate_ignored",
            id: existing._id,
            syncedAt: existing.syncedAt,
          });
        }
      }
    } catch (err) {
      console.error(`Error syncing report ${clientGeneratedId}:`, err);
      failed.push({
        clientGeneratedId,
        status: "persistence_failed",
        error: err.message || "Failed to persist report",
      });
    }
  }

  return {
    success: failed.length === 0 || results.length > 0,
    summary: {
      total: reports.length,
      syncedCount,
      updatedCount,
      duplicateCount,
      failedCount: failed.length,
    },
    results,
    failed,
  };
}

/**
 * Mirrors ActivityReport into the legacy Activity collection so existing
 * dashboard metrics, participant counts, and evaluation APIs reflect offline syncs.
 */
async function mirrorToLegacyActivity({
  clientGeneratedId,
  schoolId,
  programName,
  studentCount,
  activityDetails,
  photoUrls,
  clientCreatedAt,
  programMap,
}) {
  try {
    // Only attempt mirroring if MongoDB connection is active
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    const legacyData = {
      activityType: activityDetails?.type || programName || "Activity",
      date: clientCreatedAt,
      participants: studentCount,
      averageScore:
        activityDetails?.score !== undefined
          ? Number(activityDetails.score)
          : activityDetails?.averageScore !== undefined
          ? Number(activityDetails.averageScore)
          : undefined,
      notes: activityDetails?.notes || "",
      photos: photoUrls,
      localId: clientGeneratedId,
    };


    if (schoolId && mongoose.isValidObjectId(schoolId)) {
      legacyData.schoolId = schoolId;
    }

    const matchedProgId = programMap.get(programName.toLowerCase().trim());
    if (matchedProgId) {
      legacyData.programId = matchedProgId;
    }

    await Activity.findOneAndUpdate(
      { localId: clientGeneratedId },
      { $set: legacyData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    // Mirroring error should not fail the primary sync response
    console.warn(`[Sync Mirroring Warning] Could not mirror to Activity: ${err.message}`);
  }
}
