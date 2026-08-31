import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { isCloudinaryConfigured } from "../config/cloudinary.js";
import mongoose from "mongoose";

// @desc    Get dashboard metrics & overview
// @route   GET /api/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ featured: true });

    const totalReviews = await Review.countDocuments();
    const publishedReviews = await Review.countDocuments({ isPublished: true });

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name category price image isActive featured createdAt");

    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name rating text isPublished occasion createdAt");

    const isConnected = mongoose.connection.readyState === 1;

    return res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        featuredProducts,
        totalReviews,
        publishedReviews,
        recentProducts,
        recentReviews,
        system: {
          databaseConnected: isConnected,
          cloudinaryConfigured: isCloudinaryConfigured(),
          nodeEnv: process.env.NODE_ENV || "development",
        },
      },
    });
  } catch (error) {
    console.error("[Stats] Error getting dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dashboard statistics",
    });
  }
};
