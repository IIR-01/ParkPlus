const express = require('express');
const router = express.Router();
const {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// GET /api/wishlist — visitor fetches their saved gifts
router.get('/', protect, requireRole('visitor', 'admin'), getMyWishlist);

// POST /api/wishlist — visitor saves a gift
router.post('/', protect, requireRole('visitor', 'admin'), addToWishlist);

// DELETE /api/wishlist/:giftId — visitor removes a saved gift
router.delete('/:giftId', protect, requireRole('visitor', 'admin'), removeFromWishlist);

module.exports = router;
