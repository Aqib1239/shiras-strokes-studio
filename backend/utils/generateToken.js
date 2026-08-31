import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "shiras_strokes_jwt_secret_super_secure_key_2026";
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};
