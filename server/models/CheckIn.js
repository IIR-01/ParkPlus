const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    markerId: {
      type: Number,
      required: true,
    },

    locationName: {
      type: String,
      required: true,
      trim: true,
    },

    zone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CheckIn', CheckInSchema);