const express = require('express');
const router = express.Router();
const {
  checkInZone,
  completeRide,
  getMyPoints,
} = require('../controllers/pointsController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// POST /api/points/checkin — award points for a zone check-in
router.post('/checkin', protect, requireRole('visitor', 'admin'), checkInZone);

// POST /api/points/complete-ride — award points for finishing a queued ride
router.post('/complete-ride', protect, requireRole('visitor', 'admin'), completeRide);

// GET /api/points/me — visitor's total points + activity history
router.get('/me', protect, requireRole('visitor', 'admin'), getMyPoints);

module.exports = router;