import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import fs from "fs";

// @desc    Upload single or multiple images
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImages = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const uploadedUrls = [];

    if (isCloudinaryConfigured()) {
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "shiras_strokes/products",
          transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
        });

        uploadedUrls.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

        // Remove local file after uploading to Cloudinary
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    } else {
      // Local URL fallback
      for (const file of files) {
        const localUrl = `/uploads/${file.filename}`;
        uploadedUrls.push({
          url: localUrl,
          filename: file.filename,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      data: uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls,
    });
  } catch (error) {
    console.error("[Upload] Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};
