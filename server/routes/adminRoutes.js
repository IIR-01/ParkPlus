const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// GET /api/admin/dashboard — admin only
router.get('/dashboard', protect, requireRole('admin'), getDashboardStats);

module.exports = router;
