import Book from "../models/Book.js";

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

// Add new book with files
export const addBook = async (req, res) => {
  try {
    const { title, author, category } = req.body;
    const thumbnail = req.files?.thumbnail ? "/uploads/images/" + req.files.thumbnail[0].filename : "";
    const pdfFile = req.files?.pdf ? "/uploads/pdfs/" + req.files.pdf[0].filename : "";
    const uploadedBy = req.headers.email || "unknown";

    const newBook = await Book.create({
      title, author, category, status: "Available",
      thumbnail, pdfFile, uploadedBy, uploadedAt: new Date()
    });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: "Error adding book" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      status: req.body.status || "Available"
    };

    if (req.files?.thumbnail) {
      updateData.thumbnail = "/uploads/images/" + req.files.thumbnail[0].filename;
    }
    if (req.files?.pdf) {
      updateData.pdfFile = "/uploads/pdfs/" + req.files.pdf[0].filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: "Error updating book" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted", book: deletedBook });
  } catch (err) {
    res.status(400).json({ message: "Error deleting book" });
  }
};
