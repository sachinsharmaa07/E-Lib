import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// get all books
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// add book
router.post("/", async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

export default router;
