import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/Admin.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { connectDB } from "../config/db.js";

dotenv.config();

export const seedProducts = [
  {
    name: "Crochet Flower Bouquet",
    category: "crochet",
    categoryLabel: "Crochet Creations",
    price: 1290,
    description:
      "A hand-crocheted bouquet of soft petals that will never wilt — wrapped in cream paper and tied with a blush ribbon.",
    materials: "Cotton yarn, floral wire, kraft wrap, satin ribbon",
    customisable: true,
    featured: true,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 8,
    image: "/assets/cat-crochet.jpg",
    images: ["/assets/cat-crochet.jpg"],
  },
  {
    name: "Handmade Floral Earrings",
    category: "accessories",
    categoryLabel: "Earrings & Accessories",
    price: 480,
    description:
      "Featherlight earrings shaped petal by petal, finished with tiny glass beads and gentle gold-tone hooks.",
    materials: "Thread, glass beads, gold-tone hooks",
    customisable: true,
    featured: true,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 7,
    image: "/assets/cat-earrings.jpg",
    images: ["/assets/cat-earrings.jpg"],
  },
  {
    name: "Custom Name Painting",
    category: "paintings",
    categoryLabel: "Paintings & Artworks",
    price: 1650,
    description:
      "Your name, hand-lettered and framed with pressed florals — a piece made for one person only.",
    materials: "Cotton canvas, acrylics, pressed flowers, wooden frame",
    customisable: true,
    featured: true,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 6,
    image: "/assets/cat-paintings.jpg",
    images: ["/assets/cat-paintings.jpg"],
  },
  {
    name: "Handmade Rakhi Set",
    category: "rakhis",
    categoryLabel: "Rakhis & Rakhi Gifts",
    price: 350,
    description:
      "A pair of pearl-and-thread rakhis, finished by hand and packed with a handwritten note.",
    materials: "Silk thread, pearls, beads, kundan detail",
    customisable: true,
    featured: true,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 5,
    image: "/assets/cat-rakhi.jpg",
    images: ["/assets/cat-rakhi.jpg"],
  },
  {
    name: "Pipe Cleaner Flower Bouquet",
    category: "pipe-cleaner",
    categoryLabel: "Pipe Cleaner Crafts",
    price: 690,
    description:
      "Soft, fuzzy blooms twisted by hand into a cheerful little bouquet — a favourite with younger hearts.",
    materials: "Pipe cleaners, ceramic vase (optional)",
    customisable: true,
    featured: true,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 4,
    image: "/assets/cat-pipecleaner.jpg",
    images: ["/assets/cat-pipecleaner.jpg"],
  },
  {
    name: "Custom Gift Box",
    category: "gifts",
    categoryLabel: "Customised Gifts",
    price: 1990,
    description:
      "A curated hamper of handmade pieces, dried flowers and a personalised tag, wrapped just for the occasion.",
    materials: "Kraft box, dried flowers, satin ribbon, handmade pieces",
    customisable: true,
    featured: true,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 9,
    image: "/assets/cat-gifts.jpg",
    images: ["/assets/cat-gifts.jpg"],
  },
  {
    name: "Everlasting Blush Bouquet",
    category: "flowers",
    categoryLabel: "Flowers & Bouquets",
    price: 1450,
    description:
      "Handpicked dried and handmade blooms in dusty rose and lavender, arranged and wrapped by hand.",
    materials: "Dried flowers, handmade petals, paper wrap",
    customisable: false,
    featured: false,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 3,
    image: "/assets/cat-flowers.jpg",
    images: ["/assets/cat-flowers.jpg"],
  },
  {
    name: "Watercolour Floral Study",
    category: "paintings",
    categoryLabel: "Paintings & Artworks",
    price: 950,
    description:
      "An original small-format watercolour on cotton paper — soft washes of peach and rose.",
    materials: "300gsm cotton paper, watercolour",
    customisable: false,
    featured: false,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 2,
    image: "/assets/cat-paintings.jpg",
    images: ["/assets/cat-paintings.jpg"],
  },
  {
    name: "Little Makers Craft Kit",
    category: "custom",
    categoryLabel: "Creative Art & Crafts",
    price: 780,
    description:
      "Everything needed for an afternoon of making — ribbons, petals, paints and a simple hand-drawn guide.",
    materials: "Assorted craft supplies, illustrated guide",
    customisable: true,
    featured: false,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 1,
    image: "/assets/cat-crafts.jpg",
    images: ["/assets/cat-crafts.jpg"],
  },
  {
    name: "Crochet Blossom Keyring",
    category: "crochet",
    categoryLabel: "Crochet Creations",
    price: 260,
    description:
      "A tiny crocheted flower that rides along in your pocket — a small, everyday piece of handmade.",
    materials: "Cotton yarn, metal ring",
    customisable: true,
    featured: false,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 10,
    image: "/assets/cat-crochet.jpg",
    images: ["/assets/cat-crochet.jpg"],
  },
  {
    name: "Rakhi Gift Hamper",
    category: "rakhis",
    categoryLabel: "Rakhis & Rakhi Gifts",
    price: 1590,
    description:
      "Two handmade rakhis, a crochet keepsake, sweets box space and a hand-lettered card in one warm bundle.",
    materials: "Handmade rakhis, crochet piece, kraft box",
    customisable: true,
    featured: false,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 11,
    image: "/assets/cat-rakhi.jpg",
    images: ["/assets/cat-rakhi.jpg"],
  },
  {
    name: "Pressed Flower Frame",
    category: "flowers",
    categoryLabel: "Flowers & Bouquets",
    price: 1120,
    description:
      "Real pressed blooms arranged behind glass — quiet, botanical and made to hang anywhere warm.",
    materials: "Pressed flowers, glass, wooden frame",
    customisable: true,
    featured: false,
    handmade: true,
    inStock: true,
    isActive: true,
    newest: 12,
    image: "/assets/cat-flowers.jpg",
    images: ["/assets/cat-flowers.jpg"],
  },
];

export const seedReviews = [
  {
    name: "Ananya R.",
    occasion: "Birthday gift",
    rating: 5,
    text: "Absolutely loved the handmade bouquet. The details were beautiful and it felt so personal.",
    isPublished: true,
    isFeatured: true,
  },
  {
    name: "Meera S.",
    occasion: "Raksha Bandhan",
    rating: 5,
    text: "Such a beautiful gift! You can really see the effort and love behind the work.",
    isPublished: true,
    isFeatured: true,
  },
  {
    name: "Kabir J.",
    occasion: "Anniversary",
    rating: 5,
    text: "Everything looked even better in person. Beautifully crafted and thoughtfully packed.",
    isPublished: true,
    isFeatured: true,
  },
  {
    name: "Ritika P.",
    occasion: "Home décor",
    rating: 5,
    text: "The pressed flower frame is now the first thing guests notice in our living room. Truly special.",
    isPublished: true,
    isFeatured: false,
  },
  {
    name: "Sanya M.",
    occasion: "Custom order",
    rating: 5,
    text: "I described a colour palette and an idea, and what arrived was somehow even better than I imagined.",
    isPublished: true,
    isFeatured: false,
  },
  {
    name: "Devika N.",
    occasion: "Just because",
    rating: 5,
    text: "Ordered the crochet keyring on a whim and ended up buying six more as little gifts for friends.",
    isPublished: true,
    isFeatured: false,
  },
];

export const autoSeedDatabase = async () => {
  try {
    // 1. Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@shirasstrokes.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Shira2025!";
    const adminExists = await Admin.findOne({ email: adminEmail });

    if (!adminExists) {
      await Admin.create({
        name: "Shira's Strokes Studio",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`[Seed] Created initial admin: ${adminEmail}`);
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      console.log(`[Seed] Seeded ${seedProducts.length} initial products.`);
    }

    // 3. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany(seedReviews);
      console.log(`[Seed] Seeded ${seedReviews.length} initial reviews.`);
    }
  } catch (error) {
    console.error(`[Seed] Seeding error:`, error.message);
  }
};

const runStandaloneSeed = async () => {
  await connectDB();
  await autoSeedDatabase();
  console.log("[Seed] Completed standalone seeding.");
  process.exit(0);
};

if (process.argv[1] && process.argv[1].endsWith("seedData.js")) {
  runStandaloneSeed();
}
