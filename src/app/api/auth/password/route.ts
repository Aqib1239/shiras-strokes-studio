import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/server-auth";
import { Admin } from "@backend/models/Admin.js";
import { generateToken } from "@backend/utils/generateToken.js";

export async function PUT(req: Request) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Please provide both current and new password" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(adminAuth._id);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin account not found" },
        { status: 404 }
      );
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password does not match" },
        { status: 400 }
      );
    }

    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      token: generateToken(admin._id),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
