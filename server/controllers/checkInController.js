const CheckIn = require('../models/CheckIn');

// GET /api/checkins
// Get only the logged-in visitor's check-in history
const getMyCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({
      visitor: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(checkIns);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/checkins
// Save a new check-in for the logged-in visitor
const createCheckIn = async (req, res) => {
  try {
    const { markerId, locationName, zone } = req.body;

    if (
      markerId === undefined ||
      markerId === null ||
      !locationName ||
      !zone
    ) {
      return res.status(400).json({
        message: 'markerId, locationName and zone are required',
      });
    }

    const checkIn = await CheckIn.create({
      visitor: req.user._id,
      markerId,
      locationName,
      zone,
    });

    res.status(201).json({
      message: 'Check-in saved successfully',
      item: checkIn,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/checkins/:id
// Remove one check-in belonging to this visitor
const deleteCheckIn = async (req, res) => {
  try {
    const deleted = await CheckIn.findOneAndDelete({
      _id: req.params.id,
      visitor: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Check-in not found',
      });
    }

    res.json({
      message: 'Check-in removed',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/checkins/all
// Clear only this visitor's complete history
const clearMyCheckIns = async (req, res) => {
  try {
    const result = await CheckIn.deleteMany({
      visitor: req.user._id,
    });

    res.json({
      message: 'Check-in history cleared',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyCheckIns,
  createCheckIn,
  deleteCheckIn,
  clearMyCheckIns,
};