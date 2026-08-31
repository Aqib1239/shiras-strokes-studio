import { NextResponse } from "next/server";
import { connectDB } from "@backend/config/db.js";
import { Review } from "@backend/models/Review.js";
import { autoSeedDatabase } from "@backend/utils/seedData.js";
import { verifyAdminToken } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    await autoSeedDatabase();

    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get("includeUnpublished");
    const featured = searchParams.get("featured");

    const query: any = {};

    if (includeUnpublished !== "true") {
      query.isPublished = true;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    console.error("[API Reviews GET Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, occasion, rating, text, photo, isPublished, isFeatured } = body;

    if (!name || !text || rating === undefined) {
      return NextResponse.json(
        { success: false, message: "Customer name, rating, and review text are required" },
        { status: 400 }
      );
    }

    const review = new Review({
      name: name.trim(),
      occasion: occasion ? occasion.trim() : "",
      rating: Number(rating),
      text: text.trim(),
      photo: photo || "",
      isPublished: isPublished !== undefined ? isPublished : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
    });

    const savedReview = await review.save();

    return NextResponse.json(
      {
        success: true,
        message: "Review recorded successfully",
        data: savedReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API Reviews POST Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create review" },
      { status: 400 }
    );
  }
}
