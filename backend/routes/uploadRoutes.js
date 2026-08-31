import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Allow single or multiple image uploads
router.post("/", protectAdmin, upload.array("images", 10), uploadImages);

export default router;
