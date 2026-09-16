import Activity from "../models/Activity.js";
import Participant from "../models/Participant.js";
import Assessment from "../models/Assessment.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to save base64 image data to uploads folder
function saveBase64Image(dataUrl, localId) {
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUrl; // Not a base64 data url, return as is

    const ext = matches[1].split("/")[1] || "jpg";
    const filename = `photo-${localId || Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    const buffer = Buffer.from(matches[2], "base64");
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error("Failed to save base64 photo:", err);
    return null;
  }
}

/**
 * BE 2: process offline records with localId idempotency.
 * Handles activities, participants, and assessments without creating duplicates.
 */
export async function processSyncRecords(records = []) {
  const synced = [];
  const failed = [];

  for (const record of records) {
    const localId = record?.localId;
    const type = record?.type;
    const data = record?.data || {};

    if (!localId) {
      failed.push({ localId: null, reason: "Missing localId" });
      continue;
    }

    try {
      if (type === "activity") {
        // Process any base64 photos in the record
        let processedPhotos = [];
        if (Array.isArray(data.photos)) {
          processedPhotos = data.photos.map((p, idx) => {
            if (typeof p === "string" && p.startsWith("data:image")) {
              return saveBase64Image(p, `${localId}-${idx}`);
            }
            return p;
          }).filter(Boolean);
        } else if (data.photoData && typeof data.photoData === "string" && data.photoData.startsWith("data:image")) {
          const saved = saveBase64Image(data.photoData, localId);
          if (saved) processedPhotos.push(saved);
        }

        const activityData = {
          activityType: data.activityType || "Activity",
          date: data.date ? new Date(data.date) : new Date(),
          participants: Number(data.participants) || 0,
          averageScore: data.averageScore !== undefined && data.averageScore !== "" ? Number(data.averageScore) : undefined,
          notes: data.notes || "",
          photos: processedPhotos.length > 0 ? processedPhotos : (data.photos || []),
          localId,
        };

        if (data.programId && data.programId !== "null" && data.programId.length === 24) {
          activityData.programId = data.programId;
        }
        if (data.schoolId && data.schoolId !== "null" && data.schoolId.length === 24) {
          activityData.schoolId = data.schoolId;
        }

        // Idempotent upsert by localId
        await Activity.findOneAndUpdate(
          { localId },
          { $set: activityData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        synced.push(localId);
      } else if (type === "participant") {
        const participantData = {
          name: data.name,
          age: data.age ? Number(data.age) : undefined,
          score: data.score !== undefined && data.score !== "" ? Number(data.score) : undefined,
          localId,
        };

        if (data.schoolId && data.schoolId !== "null" && data.schoolId.length === 24) {
          participantData.schoolId = data.schoolId;
        }

        await Participant.findOneAndUpdate(
          { localId },
          { $set: participantData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        synced.push(localId);
      } else if (type === "assessment") {
        const assessmentData = {
          beforeScore: Number(data.beforeScore) || 0,
          afterScore: Number(data.afterScore) || 0,
          localId,
        };

        if (data.participantId && data.participantId.length === 24) {
          assessmentData.participantId = data.participantId;
        }
        if (data.programId && data.programId.length === 24) {
          assessmentData.programId = data.programId;
        }

        await Assessment.findOneAndUpdate(
          { localId },
          { $set: assessmentData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        synced.push(localId);
      } else {
        failed.push({ localId, reason: `Unknown record type '${type}'` });
      }
    } catch (err) {
      console.error(`Sync error for record ${localId}:`, err);
      failed.push({ localId, reason: err.message || "Failed to persist record" });
    }
  }

  return {
    success: true,
    synced,
    failed,
    syncedCount: synced.length,
    failedCount: failed.length,
  };
}

