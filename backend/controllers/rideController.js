const rides = require("../models/Ride");

const getRides = (req, res) => {
    res.json(rides);
};

const updateRide = (req, res) => {
    const { id, waitTime } = req.body;

    const ride = rides.find(r => r.id == id);

    if (!ride) {
        return res.status(404).json({
            message: "Ride not found"
        });
    }

    ride.waitTime = waitTime;

    res.json({
        message: "Wait time updated successfully",
        ride
    });
};

module.exports = {
    getRides,
    updateRide
};