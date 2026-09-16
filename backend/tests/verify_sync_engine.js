import express from "express";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import ActivityReport from "../models/ActivityReport.js";
import syncRouter from "../routes/sync.js";
import { processBatchReports } from "../services/batchSyncService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log("==================================================");
  console.log("   YUWA OFFLINE & SYNC ENGINE VERIFICATION SUITE  ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 1: ActivityReport Mongoose Schema
  // ----------------------------------------------------
  console.log("\n[TEST SUITE 1] ActivityReport Schema & Field Validation");

  // 1.1 Test missing required fields
  const invalidDoc = new ActivityReport({});
  const validationError = invalidDoc.validateSync();
  assert(
    validationError?.errors["clientGeneratedId"] !== undefined,
    "Validates that clientGeneratedId is required"
  );
  assert(
    validationError?.errors["programName"] !== undefined,
    "Validates that programName is required"
  );
  assert(
    validationError?.errors["clientCreatedAt"] !== undefined,
    "Validates that clientCreatedAt is required"
  );

  // 1.2 Test invalid enum value
  const invalidEnumDoc = new ActivityReport({
    clientGeneratedId: "uuid-1234",
    programName: "InvalidProgram123",
    clientCreatedAt: new Date(),
  });
  const enumError = invalidEnumDoc.validateSync();
  assert(
    enumError?.errors["programName"] !== undefined,
    "Validates programName against supported enum values"
  );

  // 1.3 Test valid ActivityReport schema instance
  const validDoc = new ActivityReport({
    clientGeneratedId: "c18a513e-6701-4dd9-a541-e4eb24ce349b",
    schoolId: "66e852a3f9104f2101234567",
    programName: "Ecolympics",
    studentCount: 45,
    activityDetails: { beforeScore: 50, afterScore: 82, notes: "Recycling drill" },
    photoUrls: ["/uploads/proofs/proof-1.jpg"],
    status: "synced",
    clientCreatedAt: new Date("2026-09-16T10:00:00.000Z"),
  });
  const validErr = validDoc.validateSync();
  assert(validErr === undefined, "Valid document passes all schema validation constraints");
  assert(validDoc.status === "synced", "Default status is 'synced'");
  assert(validDoc.syncedAt instanceof Date, "syncedAt timestamp is automatically populated");

  // ----------------------------------------------------
  // TEST SUITE 2: Multi-part Proof-of-Work Photo Uploads
  // ----------------------------------------------------
  console.log("\n[TEST SUITE 2] Proof Photo Uploads (POST /api/sync/upload-proofs)");

  // Setup express test server
  const app = express();
  app.use(express.json());
  app.use("/api/sync", syncRouter);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 2.1 Test valid image upload
    const boundary = "----YUWAFormBoundary" + Math.random().toString(16);
    const dummyImageBuffer = Buffer.from(
      "GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    );

    const postBody = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="photos"; filename="field_proof_1.gif"\r\n` +
          `Content-Type: image/gif\r\n\r\n`
      ),
      dummyImageBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadRes = await fetch(`${baseUrl}/api/sync/upload-proofs`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: postBody,
    });

    const uploadData = await uploadRes.json();
    assert(uploadRes.status === 201, "Upload endpoint returns HTTP 201 Created");
    assert(uploadData.success === true, "Upload response has success: true");
    assert(uploadData.uploaded?.length === 1, "Uploaded count is 1");
    assert(uploadData.uploaded[0].originalFilename === "field_proof_1.gif", "Preserves originalFilename");
    assert(
      uploadData.uploaded[0].fileUrl.startsWith("/uploads/proofs/proof-"),
      "Generates secure fileUrl under /uploads/proofs/"
    );

    // Verify file exists on disk
    const savedPath = path.resolve(__dirname, "..", uploadData.uploaded[0].fileUrl.replace(/^\//, ""));
    assert(fs.existsSync(savedPath), "Uploaded file successfully persisted on disk");
    // Clean up test file
    if (fs.existsSync(savedPath)) fs.unlinkSync(savedPath);

    // 2.2 Test invalid MIME type rejection (e.g. text/plain)
    const badMimeBody = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="photos"; filename="report.txt"\r\n` +
          `Content-Type: text/plain\r\n\r\n`
      ),
      Buffer.from("This is a plain text file, not a photo"),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const badMimeRes = await fetch(`${baseUrl}/api/sync/upload-proofs`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: badMimeBody,
    });

    const badMimeData = await badMimeRes.json();
    assert(badMimeRes.status === 400, "Rejects non-image files with HTTP 400");
    assert(badMimeData.error === "INVALID_FILE_TYPE", "Returns INVALID_FILE_TYPE error code");

    // 2.3 Test file size limit (>5MB rejection)
    const largeBoundary = "----YUWALargeBoundary" + Math.random().toString(16);
    const oversizedBuffer = Buffer.alloc(5.5 * 1024 * 1024); // 5.5MB

    const oversizedBody = Buffer.concat([
      Buffer.from(
        `--${largeBoundary}\r\n` +
          `Content-Disposition: form-data; name="photos"; filename="huge_photo.jpg"\r\n` +
          `Content-Type: image/jpeg\r\n\r\n`
      ),
      oversizedBuffer,
      Buffer.from(`\r\n--${largeBoundary}--\r\n`),
    ]);

    const oversizedRes = await fetch(`${baseUrl}/api/sync/upload-proofs`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${largeBoundary}`,
      },
      body: oversizedBody,
    });

    const oversizedData = await oversizedRes.json();
    assert(oversizedRes.status === 400, "Rejects files > 5MB with HTTP 400");
    assert(oversizedData.error === "FILE_TOO_LARGE", "Returns FILE_TOO_LARGE error code");

    // 2.4 Test empty photos upload
    const emptyRes = await fetch(`${baseUrl}/api/sync/upload-proofs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const emptyData = await emptyRes.json();
    assert(emptyRes.status === 400, "Rejects request when no photos are uploaded");
    assert(emptyData.error === "NO_FILES_PROVIDED", "Returns NO_FILES_PROVIDED code");
  } finally {
    server.close();
  }

  // ----------------------------------------------------
  // TEST SUITE 3: Bulk Offline Sync & Idempotency Engine
  // ----------------------------------------------------
  console.log("\n[TEST SUITE 3] Bulk Sync & Idempotency (POST /api/sync/batch)");

  // Test batch sync service logic with mock repository
  const mockStorage = new Map();

  // Patch ActivityReport methods for testing batch logic without live MongoDB daemon
  const origFindOne = ActivityReport.findOne;
  const origCreate = ActivityReport.create;

  ActivityReport.findOne = async function (filter) {
    return mockStorage.get(filter.clientGeneratedId) || null;
  };

  ActivityReport.create = async function (data) {
    const doc = {
      _id: "mock-id-" + Math.random().toString(36).substring(2, 9),
      ...data,
      save: async function () {
        mockStorage.set(this.clientGeneratedId, this);
        return this;
      },
    };
    mockStorage.set(data.clientGeneratedId, doc);
    return doc;
  };

  try {
    const testBatchPayload = [
      {
        clientGeneratedId: "uuid-device-101",
        schoolId: "66e852a3f9104f2100000001",
        programName: "Green Gurukul",
        studentCount: 35,
        activityDetails: { topic: "Composting", baselineScore: 40, endScore: 78 },
        photoUrls: ["/uploads/proofs/proof-101.jpg"],
        clientCreatedAt: "2026-09-16T09:30:00.000Z",
      },
      {
        clientGeneratedId: "uuid-device-102",
        schoolId: "66e852a3f9104f2100000002",
        programName: "Ecolympics",
        studentCount: 50,
        activityDetails: { topic: "Waste Segregation", quizAverage: 88 },
        photoUrls: ["/uploads/proofs/proof-102.jpg"],
        clientCreatedAt: "2026-09-16T11:00:00.000Z",
      },
    ];

    // 3.1 Initial Ingestion
    const firstSync = await processBatchReports(testBatchPayload);
    assert(firstSync.success === true, "Batch sync returns success: true");
    assert(firstSync.summary.syncedCount === 2, "Both new offline records synced");
    assert(firstSync.summary.duplicateCount === 0, "Duplicate count is initially 0");
    assert(firstSync.results[0].status === "synced", "Record 1 marked as 'synced'");
    assert(firstSync.results[1].status === "synced", "Record 2 marked as 'synced'");

    // 3.2 Idempotent Re-sync (Duplicate Prevention)
    const duplicateSync = await processBatchReports(testBatchPayload);
    assert(duplicateSync.summary.duplicateCount === 2, "Submitting identical batch marks all as duplicates");
    assert(duplicateSync.summary.syncedCount === 0, "No new records inserted on duplicate sync");
    assert(duplicateSync.results[0].status === "duplicate_ignored", "Status is 'duplicate_ignored'");

    // 3.3 Conflict Resolution / Update
    const updatedPayload = [
      {
        clientGeneratedId: "uuid-device-101",
        schoolId: "66e852a3f9104f2100000001",
        programName: "Green Gurukul",
        studentCount: 42, // Updated count
        activityDetails: { topic: "Composting", baselineScore: 40, endScore: 85, notes: "Added bonus quiz" },
        photoUrls: ["/uploads/proofs/proof-101.jpg", "/uploads/proofs/proof-101-b.jpg"], // Added photo
        clientCreatedAt: "2026-09-16T12:00:00.000Z", // Newer timestamp
      },
    ];

    const updateSync = await processBatchReports(updatedPayload);
    assert(updateSync.summary.updatedCount === 1, "Report with updated content and newer timestamp is updated");
    assert(updateSync.results[0].status === "updated", "Status is 'updated'");

    const updatedDoc = mockStorage.get("uuid-device-101");
    assert(updatedDoc.studentCount === 42, "Stored studentCount updated to 42");
    assert(updatedDoc.photoUrls.length === 2, "Stored photoUrls updated to 2 items");

    // 3.4 Validation failure inside batch does not break other valid reports
    const mixedBatch = [
      {
        // Missing clientGeneratedId
        programName: "Ecolympics",
        clientCreatedAt: "2026-09-16T10:00:00.000Z",
      },
      {
        clientGeneratedId: "uuid-device-103",
        programName: "Waste Warriors Club",
        studentCount: 20,
        clientCreatedAt: "2026-09-16T13:00:00.000Z",
      },
    ];

    const mixedResult = await processBatchReports(mixedBatch);
    assert(mixedResult.summary.syncedCount === 1, "Valid record in mixed batch synced successfully");
    assert(mixedResult.summary.failedCount === 1, "Invalid record cleanly recorded in failed array");
    assert(mixedResult.failed[0].status === "validation_failed", "Failed record has validation_failed status");
  } finally {
    ActivityReport.findOne = origFindOne;
    ActivityReport.create = origCreate;
  }

  // ----------------------------------------------------
  // TEST SUMMARY
  // ----------------------------------------------------
  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
