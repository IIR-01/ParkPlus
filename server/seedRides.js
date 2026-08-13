const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ride = require('./models/Ride');

dotenv.config();

const seedRides = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingRides = await Ride.countDocuments();

    if (existingRides > 0) {
      console.log('Rides already exist. No seeding needed.');
      process.exit(0);
    }

    await Ride.insertMany([
      {
        name: 'Roller Coaster',
        waitTime: 20,
      },
      {
        name: 'Ferris Wheel',
        waitTime: 10,
      },
      {
        name: 'Water Splash',
        waitTime: 15,
      },
    ]);

    console.log('✅ Ride data added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed rides:', error.message);
    process.exit(1);
  }
};

seedRides();