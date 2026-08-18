const Ticket = require('../models/Ticket');
const LostChildReport = require('../models/LostChildReport');
const Ride = require('../models/Ride');

const DEFAULT_WAIT_THRESHOLD = 30; // minutes

// Helper — returns start and end of today (midnight to midnight)
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// -------------------------------------------------------
// @route   GET /api/admin/dashboard
// @desc    Live admin overview — checked-in visitors, open lost-child
//          alerts, and rides exceeding a wait-time threshold
// @access  Private — admin only
// -------------------------------------------------------
const getDashboardStats = async (req, res) => {
  try {
    const threshold = req.query.threshold !== undefined
      ? Number(req.query.threshold)
      : DEFAULT_WAIT_THRESHOLD;

    if (Number.isNaN(threshold) || threshold < 0) {
      return res.status(400).json({ message: 'threshold must be a non-negative number' });
    }

    const { start, end } = getTodayRange();

    const [checkedInVisitors, openAlerts, ridesOverThreshold] = await Promise.all([
      Ticket.countDocuments({
        isUsed: true,
        entryTimestamp: { $gte: start, $lte: end },
      }),
      LostChildReport.countDocuments({ status: 'open' }),
      Ride.find({ waitTime: { $gt: threshold } }).sort({ waitTime: -1 }),
    ]);

    res.json({
      checkedInVisitors,
      openAlerts,
      waitThreshold: threshold,
      ridesOverThreshold: ridesOverThreshold.map((ride) => ({
        _id: ride._id,
        name: ride.name,
        waitTime: ride.waitTime,
      })),
      ridesOverThresholdCount: ridesOverThreshold.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
