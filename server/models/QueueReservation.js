const mongoose = require('mongoose');

const QueueReservationSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },

    returnTimeStart: {
      type: Date,
      required: true,
    },

    returnTimeEnd: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'expired'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'QueueReservation',
  QueueReservationSchema
);