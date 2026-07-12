const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables FIRST before anything else
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// Allow requests from your React frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROUTES
// ============================================================

// Health check — confirms server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ParkPlus server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Ticket routes
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Wishlist routes
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

// ============================================================
// 404 HANDLER — catches any route that doesn't exist
// ============================================================
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});