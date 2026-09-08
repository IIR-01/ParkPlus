const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
<<<<<<< HEAD
      enum: ['zone_checkin', 'ride_completed'],
=======
      enum: ['zone_checkin', 'ride_completed', 'challenge_completed'],
>>>>>>> 8e45407319e716fb3ba1aaa6c50bc2f05090b49d
      required: true,
    },
    refName: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

ActivitySchema.index({ visitor: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);