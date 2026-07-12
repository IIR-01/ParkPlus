const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');

// Helper — generates a unique readable ticket ID
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PARK-${timestamp}-${random}`;
};

// Helper — returns start and end of today (midnight to midnight)
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// -------------------------------------------------------
// @route   POST /api/tickets/generate
// @desc    Generate a new QR entry ticket for a visitor
// @access  Private — visitor only
// -------------------------------------------------------
const generateTicket = async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    // F3 — Block if visitor already has a ticket for today
    const existingTicket = await Ticket.findOne({
      visitor: req.user._id,
      validDate: { $gte: start, $lte: end },
    });

    if (existingTicket) {
      return res.status(400).json({
        message: 'You already have a ticket for today.',
        ticket: existingTicket,
      });
    }

    // F1 — Generate unique ticket ID
    const ticketId = generateUniqueId();

    // F1 — Generate QR code as base64 image
    const qrCode = await QRCode.toDataURL(ticketId, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff',
      },
    });

    // Save to database
    const ticket = await Ticket.create({
      ticketId,
      visitor: req.user._id,
      qrCode,
      validDate: new Date(),
      isUsed: false,
    });

    res.status(201).json({
      message: 'Ticket generated successfully!',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   POST /api/tickets/validate
// @desc    Staff validates a ticket ID at the gate
// @access  Private — staff and admin only
// -------------------------------------------------------
const validateTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ message: 'Ticket ID is required' });
    }

    // Find ticket in database
    const ticket = await Ticket.findOne({ ticketId: ticketId.trim().toUpperCase() })
      .populate('visitor', 'name email');

    // Ticket not found
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: '❌ Ticket not found. This ID does not exist in the system.',
      });
    }

    // F3 — Ticket already used
    if (ticket.isUsed) {
      return res.status(400).json({
        success: false,
        message: `❌ Ticket already used. Entry was recorded at ${new Date(ticket.entryTimestamp).toLocaleTimeString()}.`,
        ticket,
      });
    }

    // Check ticket is valid for today
    const { start, end } = getTodayRange();
    const ticketDate = new Date(ticket.validDate);
    if (ticketDate < start || ticketDate > end) {
      return res.status(400).json({
        success: false,
        message: `❌ Ticket expired. This ticket was valid for ${ticketDate.toLocaleDateString()}.`,
      });
    }

    // F2 — Mark as used and log entry time
    ticket.isUsed = true;
    ticket.entryTimestamp = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: `✅ Entry granted! Welcome, ${ticket.visitor.name}!`,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/tickets/my
// @desc    Get all tickets for the logged-in visitor
// @access  Private — visitor only
// -------------------------------------------------------
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ visitor: req.user._id })
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateTicket, validateTicket, getMyTickets };