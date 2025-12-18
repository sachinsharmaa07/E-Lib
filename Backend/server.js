// ============================================================================
// EXPRESS SERVER SETUP - NODE.JS + EXPRESS FUNDAMENTALS
// ============================================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

// CONCEPT: Environment Configuration
// - Load .env variables for secure config (DB_URI, PORT, etc.)
dotenv.config();

// CONCEPT: Database Connection
// - Establish MongoDB connection on startup
connectDB();

// CONCEPT: Express App Initialization
// - Create Express application instance
const app = express();

// CONCEPT: MIDDLEWARE - Processing Pipeline
// - CORS: Enable cross-origin requests from frontend
// - JSON Parser: Convert request body to JSON (50MB limit for file uploads)
// - URL Encoder: Parse URL-encoded data
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CONCEPT: Static File Serving
// - Serve uploaded files (images, PDFs) as static resources
app.use("/uploads", express.static("uploads"));

// CONCEPT: Directory Management
// - Create upload directories if they don't exist (for file storage)
["uploads", "uploads/images", "uploads/pdfs"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// CONCEPT: RESTful Routing
// - Mount route handlers at specific paths
// - /api/auth: User authentication (login, register)
// - /api/books: Book management operations
// - /api/borrow: Borrowing request handling
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// CONCEPT: Health Check Endpoint
// - Simple endpoint to verify server is running
app.get("/", (req, res) => {
  res.send("E-Lib Backend Running");
});

// CONCEPT: Global Error Handling Middleware
// - Catch and handle errors from all routes
// - Provides consistent error responses
// - Handles specific errors like file size limits
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Maximum size is 50MB" });
  }
  if (err.message && err.message.includes("must be")) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

// CONCEPT: Server Listener
// - Start Express server on configured PORT
// - Listens for incoming HTTP requests
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
