const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: '*', // Allow all origins for student ease and Vercel preview deploys
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Express body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Health check endpoint (placed before DB connection middleware so it responds instantly)
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'healthy',
    message: 'FindIt API is running smoothly',
    database: isConnected ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// 2. Root documentation route
app.get('/', (req, res) => {
  res.json({
    project: 'FindIt — Campus Lost & Found Portal API',
    status: 'online',
    documentation: '/api/items',
    health: '/api/health'
  });
});

// 3. Ensure DB is connected for incoming API requests
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

// 4. Mount Item Routes
app.use('/api/items', itemsRouter);

// 5. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start listening if run directly (local development)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 FindIt Backend running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📦 Items API:    http://localhost:${PORT}/api/items`);
      console.log(`===============================================`);
    });
  });
}

// Export for Vercel Serverless Function & testing
module.exports = app;
