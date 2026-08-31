import { NextResponse } from "next/server";
import { connectDB } from "@backend/config/db.js";
import { Product } from "@backend/models/Product.js";
import { Review } from "@backend/models/Review.js";
import { isCloudinaryConfigured } from "@backend/config/cloudinary.js";
import { verifyAdminToken } from "@/lib/server-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectDB();

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

    return NextResponse.json({
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
  } catch (error: any) {
    console.error("[API Stats Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
