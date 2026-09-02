import multer from "multer";
import path from "path";

// Store uploaded files in memory instead of the filesystem.
// This works with Vercel serverless functions.
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|svg/;

  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files (JPG, PNG, WebP, GIF, SVG) are allowed!"
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});