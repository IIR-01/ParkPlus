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
      enum: ['zone_checkin', 'ride_completed'],
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