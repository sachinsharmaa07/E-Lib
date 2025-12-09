import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  status: {
    type: String,
    default: "available"
  },
  thumbnail: String
});

export default mongoose.model("Book", bookSchema);
