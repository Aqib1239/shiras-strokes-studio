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
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static file serving for uploads & assets
const uploadsPath = path.join(process.cwd(), "public", "uploads");
const assetsPath = path.join(process.cwd(), "public", "assets");

app.use("/uploads", express.static(uploadsPath));
app.use("/assets", express.static(assetsPath));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Shira's Strokes Full-Stack API",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      await autoSeedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🎨 Shira's Strokes Backend Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🌿 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
