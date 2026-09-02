import express from "express";
import { getCloudinaryUsage } from "../controllers/cloudinaryController.js";

const router = express.Router();

router.get("/usage", getCloudinaryUsage);

export default router;