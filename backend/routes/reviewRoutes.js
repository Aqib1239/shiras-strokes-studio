import express from "express";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getReviews).post(protectAdmin, createReview);
router
  .route("/:id")
  .put(protectAdmin, updateReview)
  .delete(protectAdmin, deleteReview);

export default router;
