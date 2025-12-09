import express from "express";
import User from "../models/User.js";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// login (basic – no JWT yet)
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  res.json(user);
});

export default router;
