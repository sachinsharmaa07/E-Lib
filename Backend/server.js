import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

["uploads", "uploads/images", "uploads/pdfs"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req, res) => {
  res.send("E-Lib Backend Running");
});

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Maximum size is 50MB" });
  }
  if (err.message && err.message.includes("must be")) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
