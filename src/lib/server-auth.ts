import jwt from "jsonwebtoken";
import { Admin } from "@backend/models/Admin.js";
import { connectDB } from "@backend/config/db.js";

export const verifyAdminToken = async (req: Request) => {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "shiras_strokes_jwt_secret_super_secure_key_2026";
    const decoded = jwt.verify(token, secret) as { id: string };

    const admin = await Admin.findById(decoded.id).select("-password");
    return admin;
  } catch (error) {
    return null;
  }
};
