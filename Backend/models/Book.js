// ============================================================================
// BOOK MODEL - MONGODB SCHEMA FOR LIBRARY INVENTORY
// ============================================================================
// CONCEPT: MongoDB Schema with Inventory Tracking
// - Manages book metadata and quantity tracking for library system

import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  // Book metadata
  title: String,
  author: String,
  category: String,
  
  // Book files and media
  thumbnail: String,           // Image path (cover image)
  pdfFile: String,             // PDF path (book content)
  
  // Admin who uploaded the book
  uploadedBy: String,
  
  // CONCEPT: Inventory Management
  // - quantity: Total copies in library
  // - availableQuantity: Copies available for borrowing
  // - Used to track stock and prevent over-borrowing
  quantity: { type: Number, default: 1 },
  availableQuantity: { type: Number, default: 1 },
  
  // Book availability status
  status: { type: String, default: "Available" },
  
  // Timestamp of when book was added
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true }); // CONCEPT: Auto-manages createdAt and updatedAt

// CONCEPT: Model Creation
// - Mongoose creates 'books' collection based on this schema
export default mongoose.model("Book", bookSchema);
