const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // What kind of visitor activity counts toward this challenge.
    // 'points' tracks cumulative points earned from any activity.
    type: {
      type: String,
      enum: ['zone_checkin', 'ride_completed', 'points'],
      required: true,
    },
    // How much progress is needed to complete the challenge
    // (a count of check-ins/rides, or a points total).
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    // Bonus points awarded to the visitor on completion.
    reward: {
      type: Number,
      required: true,
      min: 0,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', ChallengeSchema);
