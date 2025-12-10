import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  bookId: mongoose.Schema.Types.ObjectId,
  borrowedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Borrow", borrowSchema);
