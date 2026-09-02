import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { autoSeedDatabase } from "./utils/seedData.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

// --------------------------------------------------
// Environment
// --------------------------------------------------

dotenv.config();

// --------------------------------------------------
// __dirname
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Express App
// --------------------------------------------------

const app = express();

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://shiras-strokes-studio.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// --------------------------------------------------
// Body Parsers
// --------------------------------------------------

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// --------------------------------------------------
// Static Files
// --------------------------------------------------

const uploadsPath = path.join(
  process.cwd(),
  "public",
  "uploads"
);

const assetsPath = path.join(
  process.cwd(),
  "public",
  "assets"
);

app.use(
  "/uploads",
  express.static(uploadsPath)
);

app.use(
  "/assets",
  express.static(assetsPath)
);

// --------------------------------------------------
// Database Initialization
// --------------------------------------------------

let dbInitialized = false;

const initializeDatabase = async () => {
  if (dbInitialized) {
    return;
  }

  try {
    const conn = await connectDB();

    if (conn) {
      await autoSeedDatabase();
    }

    dbInitialized = true;

    console.log("MongoDB initialized successfully");
  } catch (error) {
    console.error(
      "Database initialization failed:",
      error
    );

    throw error;
  }
};

// --------------------------------------------------
// Database Middleware
// --------------------------------------------------

app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Shira's Strokes Full-Stack API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/stats",
  statsRoutes
);

// --------------------------------------------------
// Error Handling
// --------------------------------------------------

app.use(notFound);

app.use(errorHandler);

// --------------------------------------------------
// Export Express App
// --------------------------------------------------

// Important for Vercel
export default app;