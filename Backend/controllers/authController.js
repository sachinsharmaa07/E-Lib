import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "student"
    });
    res.status(201).json({ 
      message: "User registered", 
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ 
      email: req.body.email, 
      password: req.body.password 
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ 
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
