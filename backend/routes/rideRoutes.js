const express = require("express");

const router = express.Router();

const {
    getRides,
    updateRide
} = require("../controllers/rideController");

router.get("/", getRides);

router.put("/update", updateRide);

module.exports = router;