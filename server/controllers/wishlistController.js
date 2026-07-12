const WishlistItem = require('../models/WishlistItem');

// -------------------------------------------------------
// @route   GET /api/wishlist
// @desc    Get the logged-in visitor's saved gift items
// @access  Private — visitor only
// -------------------------------------------------------
const getMyWishlist = async (req, res) => {
  try {
    const items = await WishlistItem.find({ visitor: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   POST /api/wishlist
// @desc    Save a gift item to the visitor's wishlist
// @access  Private — visitor only
// -------------------------------------------------------
const addToWishlist = async (req, res) => {
  try {
    const { giftId, name, category, linkedZone, linkedRide } = req.body;

    if (!giftId || !name) {
      return res.status(400).json({ message: 'giftId and name are required' });
    }

    // Already saved — just return the existing item instead of erroring,
    // so the frontend doesn't need special-case handling for double-clicks.
    const existing = await WishlistItem.findOne({
      visitor: req.user._id,
      giftId,
    });
    if (existing) {
      return res.status(200).json({ message: 'Already in wishlist', item: existing });
    }

    const item = await WishlistItem.create({
      visitor: req.user._id,
      giftId,
      name,
      category,
      linkedZone,
      linkedRide,
    });

    res.status(201).json({ message: 'Saved to wishlist', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   DELETE /api/wishlist/:giftId
// @desc    Remove a gift item from the visitor's wishlist
// @access  Private — visitor only
// -------------------------------------------------------
const removeFromWishlist = async (req, res) => {
  try {
    const { giftId } = req.params;

    const deleted = await WishlistItem.findOneAndDelete({
      visitor: req.user._id,
      giftId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyWishlist, addToWishlist, removeFromWishlist };
