import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
