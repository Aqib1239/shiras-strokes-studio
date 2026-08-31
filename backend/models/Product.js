import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "crochet",
        "paintings",
        "flowers",
        "accessories",
        "rakhis",
        "pipe-cleaner",
        "gifts",
        "custom",
      ],
    },
    categoryLabel: {
      type: String,
      default: "Handmade Creation",
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    materials: {
      type: String,
      default: "Handmade with artisan materials",
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    customisable: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    handmade: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    newest: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug and categoryLabel if not provided
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const categoryLabels = {
    crochet: "Crochet Creations",
    paintings: "Paintings & Artworks",
    flowers: "Flowers & Bouquets",
    accessories: "Earrings & Accessories",
    rakhis: "Rakhis & Rakhi Gifts",
    "pipe-cleaner": "Pipe Cleaner Crafts",
    gifts: "Customised Gifts",
    custom: "Creative Art & Crafts",
  };

  if (this.category && !this.categoryLabel) {
    this.categoryLabel = categoryLabels[this.category] || "Handmade Creation";
  }

  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }

  next();
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
