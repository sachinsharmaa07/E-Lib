import express from "express";
import { borrowBook, getBorrowed, returnBook, getPendingRequests, approveBorrow, rejectBorrow } from "../controllers/borrowController.js";
import { adminCheck } from "../middleware/adminCheck.js";

const router = express.Router();

router.post("/", borrowBook);
router.get("/:userId", getBorrowed);
router.post("/return", returnBook);

// Admin routes for managing borrow requests
router.get("/admin/pending", adminCheck, getPendingRequests);
router.put("/admin/approve/:borrowId", adminCheck, approveBorrow);
router.put("/admin/reject/:borrowId", adminCheck, rejectBorrow);
export default router;
