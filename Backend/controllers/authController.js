// ============================================================================
// AUTHENTICATION CONTROLLER - USER LOGIN & REGISTRATION
// ============================================================================
// CONCEPT: Controllers contain business logic for handling requests

import User from "../models/User.js";

// CONCEPT: Register Controller
// - Handles user account creation
// - Creates new user document in MongoDB
export const register = async (req, res) => {
  try {
    // CONCEPT: Async Database Operation
    // - Create new user document with provided data
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "student" // Default role for new users
    });
    
    // CONCEPT: API Response
    // - HTTP 201 (Created) status for successful registration
    // - Return user info (exclude password from response)
    res.status(201).json({ 
      message: "User registered", 
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    // CONCEPT: Error Handling
    // - HTTP 400 (Bad Request) for invalid input or duplicate email
    res.status(400).json({ message: "Registration failed" });
  }
};

// CONCEPT: Login Controller
// - Handles user authentication
// - Verifies email and password combination
export const login = async (req, res) => {
  try {
    // CONCEPT: MongoDB Query
    // - Find user with matching email AND password
    // - In production: password should be hashed (use bcrypt)
    const user = await User.findOne({ 
      email: req.body.email, 
      password: req.body.password 
    });
    
    // CONCEPT: Conditional Response
    // - If user not found: return 401 (Unauthorized)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // CONCEPT: Successful Authentication
    // - Return user info (frontend stores in localStorage)
    // - No server-side sessions; client manages state
    res.json({ 
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    // CONCEPT: Server Error
    // - HTTP 500 (Internal Server Error) for unexpected failures
    res.status(500).json({ message: "Login failed" });
  }
};
