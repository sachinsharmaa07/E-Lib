// ============================================================================
// BORROW MODEL - MONGODB SCHEMA FOR BOOK REQUEST & APPROVAL WORKFLOW
// ============================================================================
// CONCEPT: MongoDB Schema with Status Tracking
// - Manages borrow requests with approval workflow

import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  // References to User and Book documents
  userId: mongoose.Schema.Types.ObjectId,
  bookId: mongoose.Schema.Types.ObjectId,
  
  // CONCEPT: Approval Workflow Status
  // - pending: User requested, awaiting admin approval
  // - approved: Admin approved, book is now borrowed
  // - rejected: Admin rejected the request
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  
  // Timestamp when borrow request was created
  borrowedAt: { type: Date, default: Date.now },
  
  // CONCEPT: Request Lifecycle Tracking
  // - approvedAt: When admin approved the request
  // - rejectedAt: When admin rejected the request
  // - rejectionReason: Optional explanation for rejection
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String
});

// CONCEPT: Model Creation
// - Mongoose creates 'borrows' collection for tracking all borrow records
export default mongoose.model("Borrow", borrowSchema);
