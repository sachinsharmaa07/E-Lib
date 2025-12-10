import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Book from "./models/Book.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    // Clear existing users and books
    await User.deleteMany({});
    await Book.deleteMany({});

    // Add admin users
    const admins = [
      { name: "Nitish", email: "nitish@gmail.com", password: "123", role: "admin" },
      { name: "Hritik", email: "hritik@gmail.com", password: "123", role: "admin" },
      { name: "Sachin", email: "sachin@gmail.com", password: "123", role: "admin" }
    ];

    await User.insertMany(admins);
    console.log("Admin users added");

    console.log("Database seeded successfully! Books can now be added via Admin Panel.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
