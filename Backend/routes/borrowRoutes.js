import express from "express";
import Borrow from "../models/Borrow.js";

const router = express.Router();

// borrow a book
router.post("/", async (req, res) => {
  const borrow = await Borrow.create(req.body);
  res.json(borrow);
});

// get borrowed books
router.get("/:userId", async (req, res) => {
  const records = await Borrow.find({ userId: req.params.userId });
  res.json(records);
});

export default router;
