import mongoose from "mongoose";

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes("cluster0.mongodb.net")) {
    try {
      console.log(`[MongoDB] Connecting to specified MONGODB_URI...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Could not connect to custom URI: ${err.message}`);
    }
  }

  // If external connection is not provided or fails, use MongoMemoryServer in development
  try {
    console.log(`[MongoDB] Starting embedded in-memory MongoDB instance...`);
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Embedded in-memory database running and connected.`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Error initializing database:`, error.message);
    return null;
  }
};
