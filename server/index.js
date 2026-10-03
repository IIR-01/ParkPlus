const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = require('./app');

// Vercel handles the server execution for you. 
// We only keep the local port listener IF you are running it locally.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on port ${PORT}`);
  });
}

// CRITICAL FOR VERCEL: Export the app instance
module.exports = app;
