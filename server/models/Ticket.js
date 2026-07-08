// Ticket Model
// TODO: Fill in Sprint 1

const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qrCode: { type: String }, // base64 string
    validDate: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    entryTimestamp: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);