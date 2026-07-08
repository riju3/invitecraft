import express from "express";
import multer from "multer";
import verifyToken from "../middleware/auth.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const router = express.Router();

// Keep files in memory, then stream to Cloudinary (no local disk writes needed)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per photo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// POST /api/upload  - protected, couple uploads photos while building their invite
// Accepts up to 10 photos in one request under field name "photos".
// Wrapped manually (instead of passing upload.array(...) straight to Express)
// so multer-specific errors - file too large, wrong file type, too many
// files - return a clean 400 message instead of falling through to a
// generic 500. This matters more on multer 2.x, where these errors surface
// differently than they did on 1.x.
router.post("/", verifyToken, (req, res) => {
  upload.array("photos", 10)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: "Each photo must be under 8MB.",
        LIMIT_FILE_COUNT: "You can upload up to 10 photos at a time.",
        LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
      };
      return res.status(400).json({ message: messages[err.code] || err.message });
    }
    if (err) {
      // Covers our custom fileFilter rejection ("Only image files are allowed.")
      return res.status(400).json({ message: err.message || "Upload failed." });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No photos were sent." });
      }

      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, "wedding-invites")
      );

      const results = await Promise.all(uploadPromises);

      const photos = results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      res.status(200).json({ photos });
    } catch (uploadError) {
      res.status(500).json({ message: "Photo upload failed.", error: uploadError.message });
    }
  });
});

export default router;
