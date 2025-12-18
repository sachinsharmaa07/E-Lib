// ============================================================================
// BOOK CONTROLLER - CRUD OPERATIONS & INVENTORY MANAGEMENT
// ============================================================================
// CONCEPT: Controllers implement business logic for handling HTTP requests

import Book from "../models/Book.js";

// CONCEPT: READ Operation (GET)
// - Retrieve all books from database
// - Returns complete book list with all metadata
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

// CONCEPT: CREATE Operation (POST)
// - Add new book to library inventory
// - Handles file uploads (thumbnail image, PDF file)
export const addBook = async (req, res) => {
  try {
    // CONCEPT: Data Extraction from Request Body
    const { title, author, category, quantity } = req.body;
    
    // CONCEPT: Type Conversion & Default Values
    const bookQuantity = parseInt(quantity) || 1;
    
    // CONCEPT: File Path Management
    // - Store file paths from uploaded files
    // - Files handled by multer middleware
    const thumbnail = req.files?.thumbnail ? "/uploads/images/" + req.files.thumbnail[0].filename : "";
    const pdfFile = req.files?.pdf ? "/uploads/pdfs/" + req.files.pdf[0].filename : "";
    const uploadedBy = req.headers.email || "unknown";

    // CONCEPT: Document Creation
    // - Create new Book document in MongoDB
    // - Initialize both quantity and availableQuantity
    const newBook = await Book.create({
      title, author, category, status: "Available",
      thumbnail, pdfFile, uploadedBy, 
      quantity: bookQuantity,
      availableQuantity: bookQuantity,
      uploadedAt: new Date()
    });
    
    // CONCEPT: HTTP Response
    // - HTTP 201 (Created) status
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: "Error adding book" });
  }
};

// CONCEPT: UPDATE Operation (PUT)
// - Modify existing book details and files
export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    // CONCEPT: Object Building for Updates
    // - Only update provided fields
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      status: req.body.status || "Available"
    };

    // CONCEPT: Conditional Quantity Update
    // - If new quantity provided, recalculate available quantity
    // - Difference = new quantity - old quantity
    if (req.body.quantity) {
      const newQuantity = parseInt(req.body.quantity);
      updateData.quantity = newQuantity;
      
      // CONCEPT: Inventory Adjustment Logic
      // - Calculate how many new copies were added/removed
      // - Update available quantity accordingly
      const book = await Book.findById(bookId);
      const quantityDifference = newQuantity - (book?.quantity || 0);
      updateData.availableQuantity = (book?.availableQuantity || 0) + quantityDifference;
    }

    // CONCEPT: Conditional File Updates
    // - Replace files if new ones uploaded
    if (req.files?.thumbnail) {
      updateData.thumbnail = "/uploads/images/" + req.files.thumbnail[0].filename;
    }
    if (req.files?.pdf) {
      updateData.pdfFile = "/uploads/pdfs/" + req.files.pdf[0].filename;
    }

    // CONCEPT: MongoDB Update Operation
    // - findByIdAndUpdate: Locate by ID and apply changes
    // - { new: true }: Return updated document
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true }
    );
    
    // CONCEPT: Error Response
    // - HTTP 404 (Not Found) if book doesn't exist
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: "Error updating book" });
  }
};

// CONCEPT: Specialized UPDATE for Quantity Management
// - Dedicated endpoint for inventory updates
// - Admin can adjust total copies in library
export const updateBookQuantity = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { quantity } = req.body;

    // CONCEPT: Input Validation
    // - Check if quantity is valid (not negative, not null)
    if (!quantity || parseInt(quantity) < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // CONCEPT: Find Current Document
    // - Retrieve existing book to calculate differences
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // CONCEPT: Smart Inventory Calculation
    const newQuantity = parseInt(quantity);
    const oldQuantity = book.quantity;
    const quantityDifference = newQuantity - oldQuantity;

    // CONCEPT: Adjust Available Quantity
    // - Increase/decrease based on total quantity change
    // - Math.max ensures quantity never goes negative
    const newAvailableQuantity = Math.max(0, (book.availableQuantity || oldQuantity) + quantityDifference);

    // CONCEPT: Atomic Update
    // - Update both quantity and availableQuantity together
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { 
        quantity: newQuantity,
        availableQuantity: newAvailableQuantity
      },
      { new: true }
    );

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: "Error updating book quantity" });
  }
};

// CONCEPT: DELETE Operation (DELETE)
// - Remove book from library inventory
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    // CONCEPT: MongoDB Delete Operation
    // - findByIdAndDelete: Remove document by ID
    const deletedBook = await Book.findByIdAndDelete(bookId);
    
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    // CONCEPT: Delete Confirmation Response
    res.json({ message: "Book deleted", book: deletedBook });
  } catch (err) {
    res.status(400).json({ message: "Error deleting book" });
  }
};

