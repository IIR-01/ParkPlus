const User = require('../models/User');
const Activity = require('../models/Activity');

// Point values — tweak these as the team balances gameplay.
const POINTS = {
  zone_checkin: 10,
  ride_completed: 20,
};

// -------------------------------------------------------
// @route   POST /api/points/checkin
// @desc    Award points for checking in to a zone (FR-18)
// @access  Private — visitor only
// @body    { zoneName: string }
// -------------------------------------------------------
const checkInZone = async (req, res) => {
  try {
    const { zoneName } = req.body;

    if (!zoneName) {
      return res.status(400).json({ message: 'zoneName is required' });
    }

    const points = POINTS.zone_checkin;

    const activity = await Activity.create({
      visitor: req.user._id,
      type: 'zone_checkin',
      refName: zoneName,
      points,
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points } },
      { new: true }
    ).select('points');

    res.status(201).json({
      message: `+${points} points for checking in to ${zoneName}`,
      pointsAwarded: points,
      totalPoints: user.points,
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   POST /api/points/complete-ride
// @desc    Award points for completing a queued ride (FR-18)
// @access  Private — visitor only
// @body    { rideName: string }
// -------------------------------------------------------
const completeRide = async (req, res) => {
  try {
    const { rideName } = req.body;

    if (!rideName) {
      return res.status(400).json({ message: 'rideName is required' });
    }

    const points = POINTS.ride_completed;

    const activity = await Activity.create({
      visitor: req.user._id,
      type: 'ride_completed',
      refName: rideName,
      points,
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points } },
      { new: true }
    ).select('points');

    res.status(201).json({
      message: `+${points} points for completing ${rideName}`,
      pointsAwarded: points,
      totalPoints: user.points,
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/points/me
// @desc    Get the logged-in visitor's total points + activity history
// @access  Private — visitor only
// -------------------------------------------------------
const getMyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('points');
    const history = await Activity.find({ visitor: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      totalPoints: user.points,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkInZone, completeRide, getMyPoints };