const express = require('express');
const router = express.Router();
const {
  submitReport,
  getActiveReports,
  markFound,
  getAllReports,
} = require('../controllers/lostChildController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// POST /api/lostchild/report — F12, any logged-in user
router.post('/report', protect, submitReport);

// GET /api/lostchild/active — F13, staff/admin only
router.get('/active', protect, requireRole('staff', 'admin'), getActiveReports);

// PATCH /api/lostchild/:id/found — F14, staff/admin only
router.patch('/:id/found', protect, requireRole('staff', 'admin'), markFound);

// GET /api/lostchild/history — admin only
router.get('/history', protect, requireRole('admin'), getAllReports);

module.exports = router;