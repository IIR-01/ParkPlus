const QueueReservation = require('../models/QueueReservation');
const Ride = require('../models/Ride');
const expireOldReservations = async () => {
  const now = new Date();

  await QueueReservation.updateMany(
    {
      status: 'active',
      returnTimeEnd: { $lt: now },
    },
    {
      $set: { status: 'expired' },
    }
  );
};

// Create a virtual queue reservation
const createReservation = async (req, res) => {
  try {
    await expireOldReservations();
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        message: 'rideId is required',
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: 'Ride not found',
      });
    }

    const now = new Date();

    const returnTimeStart = new Date(
      now.getTime() + ride.waitTime * 60 * 1000
    );

    const returnTimeEnd = new Date(
      returnTimeStart.getTime() + 15 * 60 * 1000
    );
    const overlappingReservation = await QueueReservation.findOne({
      visitor: req.user._id,
      status: 'active',
      returnTimeStart: { $lt: returnTimeEnd },
      returnTimeEnd: { $gt: returnTimeStart },
    });

    if (overlappingReservation) {
      return res.status(409).json({
        message:
          'You already have an active reservation that overlaps with this return time.',
      });
    }
    const reservation = await QueueReservation.create({
      visitor: req.user._id,
      ride: ride._id,
      returnTimeStart,
      returnTimeEnd,
    });

    const populatedReservation = await QueueReservation.findById(
      reservation._id
    ).populate('ride', 'name waitTime');

    res.status(201).json({
      message: 'Virtual queue reservation created successfully',
      reservation: populatedReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create virtual queue reservation',
      error: error.message,
    });
  }
};

// Get logged-in visitor's reservations
const getMyReservations = async (req, res) => {
  try {
    await expireOldReservations();
    const reservations = await QueueReservation.find({
      visitor: req.user._id,
    })
      .populate('ride', 'name waitTime')
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch reservations',
      error: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
};