const mongoose = require('mongoose');

const ChallengeProgressSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One progress record per visitor per challenge
ChallengeProgressSchema.index({ visitor: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeProgress', ChallengeProgressSchema);
