import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  status: { type: String, default: "Available" },
  thumbnail: String,
  pdfFile: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
