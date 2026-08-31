import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  updateAdminPassword,
} from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);
router.put("/password", protectAdmin, updateAdminPassword);

export default router;
