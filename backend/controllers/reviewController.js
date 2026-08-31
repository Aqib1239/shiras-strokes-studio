import { Review } from "../models/Review.js";

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public / Admin
export const getReviews = async (req, res) => {
  try {
    const { includeUnpublished, featured } = req.query;
    const query = {};

    if (includeUnpublished !== "true") {
      query.isPublished = true;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("[Reviews] Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching reviews",
    });
  }
};

// @desc    Add review manually (from WhatsApp)
// @route   POST /api/reviews
// @access  Private/Admin
export const createReview = async (req, res) => {
  try {
    const { name, occasion, rating, text, photo, isPublished, isFeatured } = req.body;

    if (!name || !text || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Customer name, rating, and review text are required",
      });
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

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: savedReview,
    });
  } catch (error) {
    console.error("[Reviews] Error creating review:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await Review.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Review removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error deleting review",
    });
  }
};
