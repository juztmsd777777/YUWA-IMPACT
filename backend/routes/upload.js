import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      cb(null, true);
    } else {
      cb(null, true);
    }
  },
});

const router = Router();

router.post("/", upload.any(), (req, res) => {
  try {
    const uploadedFiles = [];

    // 1. Process multipart files
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        uploadedFiles.push({
          url: `/uploads/${f.filename}`,
          filename: f.filename,
          originalName: f.originalname,
          size: f.size
        });
      }
    } else if (req.file) {
      uploadedFiles.push({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    }

    // 2. Process base64 data URLs in body if provided
    const base64List = Array.isArray(req.body?.photos)
      ? req.body.photos
      : req.body?.dataUrl
      ? [req.body.dataUrl]
      : req.body?.photo
      ? [req.body.photo]
      : [];

    for (let i = 0; i < base64List.length; i++) {
      const item = base64List[i];
      const dataStr = typeof item === "string" ? item : (item.url || item.preview || "");
      if (dataStr.startsWith("data:image/")) {
        const matches = dataStr.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
          const base64Data = matches[2];
          const filename = `photo-b64-${Date.now()}-${i}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
          uploadedFiles.push({
            url: `/uploads/${filename}`,
            filename: filename,
            originalName: `evidence_${i + 1}.${ext}`,
            size: base64Data.length
          });
        }
      } else if (dataStr.startsWith("http") || dataStr.startsWith("/uploads")) {
        uploadedFiles.push({
          url: dataStr,
          filename: path.basename(dataStr),
          originalName: `evidence_${i + 1}.jpg`
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No photo files or valid image data provided"
      });
    }

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} photo(s)`,
      count: uploadedFiles.length,
      url: uploadedFiles[0].url,
      photos: uploadedFiles,
      uploaded: uploadedFiles
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error processing upload: " + err.message
    });
  }
});

export default router;
