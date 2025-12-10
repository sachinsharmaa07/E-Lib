import express from "express";
import { borrowBook, getBorrowed, returnBook } from "../controllers/borrowController.js";

const router = express.Router();

router.post("/", borrowBook);
router.get("/:userId", getBorrowed);
router.post("/return", returnBook);

export default router;
