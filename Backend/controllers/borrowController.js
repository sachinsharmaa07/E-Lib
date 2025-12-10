import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

// Borrow a book - check if user already borrowed it
export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Check if already borrowed by this user
    const alreadyBorrowed = await Borrow.findOne({ userId, bookId });
    if (alreadyBorrowed) {
      return res.status(400).json({ message: "You already borrowed this book" });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Create borrow record
    const borrow = await Borrow.create({
      userId,
      bookId,
      borrowedAt: new Date()
    });

    // Update book status to Issued
    await Book.findByIdAndUpdate(bookId, { status: "Issued" });

    res.status(201).json({ message: "Book borrowed successfully", borrow });
  } catch (err) {
    res.status(400).json({ message: "Error borrowing book" });
  }
};

// Get all borrowed books by user with book details
export const getBorrowed = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all borrows for user and populate book details
    const borrows = await Borrow.find({ userId }).lean();

    // Get book details for each borrow
    const borrowsWithBooks = await Promise.all(
      borrows.map(async (borrow) => {
        const book = await Book.findById(borrow.bookId);
        return {
          ...borrow,
          book: book || {}
        };
      })
    );

    res.json(borrowsWithBooks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching borrowed books" });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Remove borrow record
    const borrow = await Borrow.findOneAndDelete({ userId, bookId });
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Update book status to Available
    await Book.findByIdAndUpdate(bookId, { status: "Available" });

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error returning book" });
  }
};
