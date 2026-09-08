const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    qrCode: {
      type: String, // Stores the QR code as a base64 data URL
    },
    validDate: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    entryTimestamp: {
      type: Date,
      default: null,
    },
    groupSize: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 person must be entering'],
      max: [10, 'For groups larger than 10, please generate a second ticket'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);