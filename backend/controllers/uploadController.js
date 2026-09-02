import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import streamifier from "streamifier";

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

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured",
      });
    }

    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "shiras_strokes/products",
            transformation: [
              {
                width: 1200,
                crop: "limit",
                quality: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    };

    const uploadedUrls = [];

    for (const file of files) {
      const result = await uploadToCloudinary(file);

      uploadedUrls.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      data: uploadedUrls.length === 1
        ? uploadedUrls[0]
        : uploadedUrls,
    });
  } catch (error) {
    console.error("[Upload] Error uploading image:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};