const express = require('express');
const router = express.Router();

// TODO Sprint 1: import authController
// const { register, login, logout } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.json({ message: 'Register route — coming in Sprint 1' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Login route — coming in Sprint 1' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout route — coming in Sprint 1' });
});

module.exports = router;