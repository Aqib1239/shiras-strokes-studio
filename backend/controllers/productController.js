import { Product } from "../models/Product.js";
import mongoose from "mongoose";

// @desc    Get all products
// @route   GET /api/products
// @access  Public / Admin
export const getProducts = async (req, res) => {
  try {
    const { category, featured, search, includeInactive } = req.query;
    const query = {};

    // Only filter active products for public users unless includeInactive is explicitly true (for admin)
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

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("[Products] Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching products",
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ $or: [{ slug: id }, { _id: id }] });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching product details",
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
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
    } = req.body;

    if (!name || !category || price === undefined || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, category, price, description, and an image",
      });
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

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("[Products] Error creating product:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("[Products] Error updating product:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error deleting product",
    });
  }
};
