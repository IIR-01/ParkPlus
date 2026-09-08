const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ParkPlus server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/queue', require('./routes/queueRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/lostchild', require('./routes/lostChildRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/points', require('./routes/pointsRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/checkins', require('./routes/checkInRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;