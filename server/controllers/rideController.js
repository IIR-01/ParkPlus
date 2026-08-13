const Ride = require('../models/Ride');

// Get all rides
const getRides = async (req, res) => {
  try {
    const rides = await Ride.find().sort({ name: 1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch rides',
      error: error.message,
    });
  }
};

// Update one ride's wait time
const updateRideWaitTime = async (req, res) => {
  try {
    const { rideId, waitTime } = req.body;

    if (!rideId || waitTime === undefined) {
      return res.status(400).json({
        message: 'rideId and waitTime are required',
      });
    }

    if (Number(waitTime) < 0) {
      return res.status(400).json({
        message: 'Wait time cannot be negative',
      });
    }

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { waitTime: Number(waitTime) },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({
        message: 'Ride not found',
      });
    }

    res.status(200).json({
      message: 'Ride wait time updated successfully',
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update ride wait time',
      error: error.message,
    });
  }
};

module.exports = {
  getRides,
  updateRideWaitTime,
};