// ============================================================================
// USER MODEL - MONGODB SCHEMA DEFINITION
// ============================================================================
// CONCEPT: MongoDB Schema
// - Defines structure of documents in 'users' collection
// - Enforces field types and defaults

import mongoose from "mongoose";

// CONCEPT: Schema Definition
// - Defines fields, types, and constraints for User documents
const userSchema = new mongoose.Schema({
  // User's full name
  name: String,
  
  // Email (unique constraint - only one user per email)
  email: { type: String, unique: true },
  
  // Password (stored as plain string - in production, should be hashed)
  password: String,
  
  // Role-based access control
  // "student" = regular user, "admin" = librarian/manager
  role: { type: String, default: "student" }
}, { timestamps: true }); // CONCEPT: Auto-manages createdAt and updatedAt fields

// CONCEPT: Model Export
// - Creates 'User' model based on schema
// - MongoDB automatically pluralizes to 'users' collection
export default mongoose.model("User", userSchema);
