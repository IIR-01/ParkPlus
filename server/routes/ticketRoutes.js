const express = require('express');
const router = express.Router();
const {
  generateTicket,
  validateTicket,
  getMyTickets,
} = require('../controllers/ticketController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// POST /api/tickets/generate — visitor generates their ticket
router.post('/generate', protect, requireRole('visitor', 'admin'), generateTicket);

// POST /api/tickets/validate — staff scans/enters ticket at gate
router.post('/validate', protect, requireRole('staff', 'admin'), validateTicket);

// GET /api/tickets/my — visitor fetches their own tickets
router.get('/my', protect, requireRole('visitor', 'admin'), getMyTickets);

module.exports = router;