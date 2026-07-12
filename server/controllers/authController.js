const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper — creates a JWT token containing the user's ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// -------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Create a new user account
// @access  Public
// -------------------------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Reject if any required field is missing
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if this email is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create the user (password is hashed automatically by the pre-save hook)
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Log in with email and password, receive JWT
// @access  Public
// -------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get the currently logged-in user's profile
// @access  Private (requires JWT)
// -------------------------------------------------------
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

module.exports = { register, login, getMe };