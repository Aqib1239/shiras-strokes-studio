import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/server-auth";
import { cloudinary, isCloudinaryConfigured } from "@backend/config/cloudinary.js";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uploadedUrls: { url: string; public_id?: string }[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const filename = `product-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);

      if (isCloudinaryConfigured()) {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "shiras_strokes/products",
        });
        uploadedUrls.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else {
        uploadedUrls.push({
          url: `/uploads/${filename}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      data: uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls,
    });
  } catch (error: any) {
    console.error("[API Upload Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
