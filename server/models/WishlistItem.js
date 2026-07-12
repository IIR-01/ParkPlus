const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Gift items live in the frontend's static data (client/src/data/parkData.js),
    // so we just store the id and the display fields needed to re-render the
    // wishlist without re-joining anything. If gifts move into the DB later,
    // this can be swapped for a ref: 'Gift' relationship instead.
    giftId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    linkedZone: {
      type: String,
    },
    linkedRide: {
      type: String,
    },
  },
  { timestamps: true }
);

// A visitor can only save the same gift once
WishlistItemSchema.index({ visitor: 1, giftId: 1 }, { unique: true });

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);
