const express = require('express');
const router = express.Router();

const {
  createReservation,
  getMyReservations,
} = require('../controllers/queueController');

const {
  protect,
  requireRole,
} = require('../middleware/authMiddleware');

// POST /api/queue/reservations
router.post(
  '/reservations',
  protect,
  requireRole('visitor', 'admin'),
  createReservation
);

// GET /api/queue/reservations/me
router.get(
  '/reservations/me',
  protect,
  requireRole('visitor', 'admin'),
  getMyReservations
);

module.exports = router;