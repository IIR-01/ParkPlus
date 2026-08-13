const express = require('express');
const router = express.Router();

const {
  getRides,
  updateRideWaitTime,
} = require('../controllers/rideController');

// GET /api/rides
router.get('/', getRides);

// PUT /api/rides/wait-time
router.put('/wait-time', updateRideWaitTime);

module.exports = router;