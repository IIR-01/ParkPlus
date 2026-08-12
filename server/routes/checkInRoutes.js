const express = require('express');

const {
  getMyCheckIns,
  createCheckIn,
  deleteCheckIn,
  clearMyCheckIns,
} = require('../controllers/checkInController');

const {
  protect,
  requireRole,
} = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are visitor-specific because protect attaches req.user

router.get(
  '/',
  protect,
  requireRole('visitor'),
  getMyCheckIns
);

router.post(
  '/',
  protect,
  requireRole('visitor'),
  createCheckIn
);

// IMPORTANT: /all must come before /:id
router.delete(
  '/all',
  protect,
  requireRole('visitor'),
  clearMyCheckIns
);

router.delete(
  '/:id',
  protect,
  requireRole('visitor'),
  deleteCheckIn
);

module.exports = router;