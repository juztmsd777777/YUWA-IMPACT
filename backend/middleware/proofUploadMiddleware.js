import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROOFS_DIR = path.resolve(__dirname, "../uploads/proofs");

// Ensure target directory exists
if (!fs.existsSync(PROOFS_DIR)) {
  fs.mkdirSync(PROOFS_DIR, { recursive: true });
}

// Allowed image MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

// Maximum file size: 5MB per image
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Disk storage engine with collision-resistant and sanitized filenames
const diskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, PROOFS_DIR);
  },
  filename: function (_req, file, cb) {
    const randomHex = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = rawExt && rawExt.length <= 5 ? rawExt : ".jpg";
    const filename = `proof-${timestamp}-${randomHex}${safeExt}`;
    cb(null, filename);
  },
});

// Multer upload instance
const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 20, // Allow up to 20 proof photos per batch upload
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      const err = new Error(
        `Invalid file type '${file.mimetype}'. Only JPG, PNG, WEBP, GIF, and HEIC images are permitted.`
      );
      err.code = "INVALID_FILE_TYPE";
      cb(err);
    }
  },
});

/**
 * Middleware wrapper that executes multer array upload and transforms errors
 * into structured JSON responses rather than unhandled Express crashes.
 */
export function proofUploadMiddleware(req, res, next) {
  const uploadHandler = upload.array("photos", 20);

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "FILE_TOO_LARGE",
          message: "One or more files exceed the 5MB size limit.",
        });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          error: "UNEXPECTED_FIELD",
          message: "Files must be sent under the form field 'photos'.",
        });
      }
      return res.status(400).json({
        success: false,
        error: err.code,
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.code || "UPLOAD_ERROR",
        message: err.message,
      });
    }
    next();
  });
}
