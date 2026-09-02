import {cloudinary} from "../config/cloudinary.js";

export const getCloudinaryUsage = async (req, res) => {
  try {
    const usage = await cloudinary.api.usage();

    const storageUsed = usage.storage?.usage || 0;
    const storageLimit = usage.storage?.limit || 0;

    const usedGB = storageUsed / (1024 * 1024 * 1024);
    const totalGB = storageLimit / (1024 * 1024 * 1024);
    const freeGB = Math.max(totalGB - usedGB, 0);

    const percentage =
      totalGB > 0 ? Math.min((usedGB / totalGB) * 100, 100) : 0;

    res.status(200).json({
      success: true,
      storage: {
        used: usedGB,
        free: freeGB,
        total: totalGB,
        percentage,
      },
      resources: usage.resources || 0,
      raw: usage,
    });
  } catch (error) {
    console.error("Cloudinary usage error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Cloudinary usage",
    });
  }
};