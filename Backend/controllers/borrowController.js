// ============================================================================
// BORROW CONTROLLER - BOOK REQUEST & APPROVAL WORKFLOW
// ============================================================================
// CONCEPT: Handles borrowing requests with admin approval system

import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

// CONCEPT: Borrow Request Creation
// - User submits request to borrow a book
// - Status starts as "pending" (awaits admin approval)
export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // CONCEPT: Validation - Check for Duplicates
    // - Prevent user from requesting same book twice
    // - Check if already borrowing or have pending request
    const alreadyBorrowed = await Borrow.findOne({ 
      userId, 
      bookId, 
      status: { $in: ["approved", "pending"] }
    });
    if (alreadyBorrowed) {
      return res.status(400).json({ message: "You already have this book or have a pending request" });
    }

    // CONCEPT: Verify Book Exists
    // - Ensure book is in database before creating borrow record
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // CONCEPT: Create Pending Borrow Record
    // - Store request with pending status
    // - Admin must approve before student can access book
    const borrow = await Borrow.create({
      userId,
      bookId,
      status: "pending",
      borrowedAt: new Date()
    });

    // CONCEPT: Response with Status Code 201 (Created)
    res.status(201).json({ message: "Borrow request submitted. Waiting for admin approval", borrow });
  } catch (err) {
    res.status(400).json({ message: "Error borrowing book" });
  }
};

// CONCEPT: Retrieve User's Approved Books
// - Only returns books with "approved" status
// - Populates book details for frontend display
export const getBorrowed = async (req, res) => {
  try {
    const { userId } = req.params;

    // CONCEPT: Query Approved Borrows Only
    // - .lean() optimizes query by returning plain objects
    // - Only fetch approved status (books user can actually access)
    const borrows = await Borrow.find({ userId, status: "approved" }).lean();

    // CONCEPT: Data Enrichment - Join with Book Collection
    // - Promise.all: Execute all queries concurrently
    // - Attach full book details to each borrow record
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

// CONCEPT: Admin - View All Pending Requests
// - Shows all borrow requests awaiting admin decision
// - Includes book details for admin decision-making
export const getPendingRequests = async (req, res) => {
  try {
    // CONCEPT: Query All Pending Requests
    // - status: "pending" - only unapproved requests
    const requests = await Borrow.find({ status: "pending" }).lean();

    // CONCEPT: Populate with Book Information
    // - Admin needs full book details to make approval decisions
    const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
        const book = await Book.findById(request.bookId);
        return {
          ...request,
          book: book || {}
        };
      })
    );

    res.json(requestsWithDetails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending requests" });
  }
};

// CONCEPT: Admin - Approve Borrow Request
// - Changes status from "pending" to "approved"
// - Decreases available quantity when approved
export const approveBorrow = async (req, res) => {
  try {
    const { borrowId } = req.params;

    // CONCEPT: Fetch Borrow Record
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    // CONCEPT: Inventory Check
    // - Verify sufficient copies available before approval
    // - Prevents overborrowing of limited inventory
    const book = await Book.findById(borrow.bookId);
    if (!book || book.availableQuantity <= 0) {
      return res.status(400).json({ message: "No copies available for this book" });
    }

    // CONCEPT: Update Borrow Status
    // - Mark request as approved with timestamp
    const updatedBorrow = await Borrow.findByIdAndUpdate(
      borrowId,
      { 
        status: "approved", 
        approvedAt: new Date() 
      },
      { new: true }
    );

    // CONCEPT: Atomic Inventory Update
    // - Decrease available quantity by 1
    // - Update book status if no copies left
    await Book.findByIdAndUpdate(
      borrow.bookId,
      { 
        availableQuantity: book.availableQuantity - 1,
        status: book.availableQuantity - 1 === 0 ? "Issued" : "Available"
      }
    );

    res.json({ message: "Borrow request approved", borrow: updatedBorrow });
  } catch (err) {
    res.status(400).json({ message: "Error approving borrow request" });
  }
};

// CONCEPT: Admin - Reject Borrow Request
// - Changes status from "pending" to "rejected"
// - Optionally stores rejection reason
export const rejectBorrow = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const { reason } = req.body;

    // CONCEPT: Fetch Request to Reject
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    // CONCEPT: Update with Rejection Details
    // - Store rejection timestamp and optional reason
    // - User can see why request was denied
    const updatedBorrow = await Borrow.findByIdAndUpdate(
      borrowId,
      { 
        status: "rejected", 
        rejectedAt: new Date(),
        rejectionReason: reason || "Request rejected by admin"
      },
      { new: true }
    );

    res.json({ message: "Borrow request rejected", borrow: updatedBorrow });
  } catch (err) {
    res.status(400).json({ message: "Error rejecting borrow request" });
  }
};

// CONCEPT: Return Book to Library
// - User returns approved borrowed book
// - Increases available quantity
export const returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // CONCEPT: Remove Borrow Record
    // - Delete approved borrow record (book no longer borrowed)
    // - Only removes if status is "approved"
    const borrow = await Borrow.findOneAndDelete({ userId, bookId, status: "approved" });
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // CONCEPT: Update Inventory on Return
    // - Increase available quantity (book returned to shelf)
    // - Reset book status to "Available"
    const book = await Book.findById(bookId);
    if (book) {
      await Book.findByIdAndUpdate(
        bookId,
        { 
          availableQuantity: (book.availableQuantity || 0) + 1,
          status: "Available"
        }
      );
    }

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error returning book" });
  }
};
