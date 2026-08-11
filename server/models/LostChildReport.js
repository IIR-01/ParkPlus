const mongoose = require('mongoose');

const LostChildReportSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'A description is required'],
      trim: true,
    },
    lastSeenZone: {
      type: String,
      required: [true, 'Last-seen zone is required'],
      trim: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'found'],
      default: 'open',
    },
    foundAt: {
      type: Date,
      default: null,
    },
    foundBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostChildReport', LostChildReportSchema);