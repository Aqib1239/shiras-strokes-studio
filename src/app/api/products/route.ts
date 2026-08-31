import { NextResponse } from "next/server";
import { connectDB } from "@backend/config/db.js";
import { Product } from "@backend/models/Product.js";
import { autoSeedDatabase } from "@backend/utils/seedData.js";
import { verifyAdminToken } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    await autoSeedDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const includeInactive = searchParams.get("includeInactive");

    const query: any = {};

    if (includeInactive !== "true") {
      query.isActive = true;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { materials: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error("[API Products GET Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch products" },
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
    const {
      name,
      category,
      categoryLabel,
      price,
      description,
      materials,
      image,
      images,
      customisable,
      featured,
      handmade,
      inStock,
      isActive,
      newest,
    } = body;

    if (!name || !category || price === undefined || !description || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields: name, category, price, description, and an image",
        },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      category,
      categoryLabel,
      price: Number(price),
      description,
      materials: materials || "Artisan handcrafted materials",
      image,
      images: images && images.length > 0 ? images : [image],
      customisable: customisable !== undefined ? customisable : true,
      featured: featured !== undefined ? featured : false,
      handmade: handmade !== undefined ? handmade : true,
      inStock: inStock !== undefined ? inStock : true,
      isActive: isActive !== undefined ? isActive : true,
      newest: newest !== undefined ? Number(newest) : 0,
    });

    const savedProduct = await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API Products POST Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
