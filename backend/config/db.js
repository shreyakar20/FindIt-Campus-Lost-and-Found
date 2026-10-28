const mongoose = require('mongoose');

// Cache database connection for serverless environments (Vercel)
let cachedPromise = null;

const connectDB = async () => {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection attempt is currently in flight, return that promise
  if (cachedPromise) {
    return cachedPromise;
  }

  const mongoURI = process.env.MONGO_URI;

  // Validate presence and that it is not the default unconfigured template
  if (!mongoURI || mongoURI.includes('<username>') || mongoURI.includes('<password>') || mongoURI.includes('example.mongodb.net')) {
    console.warn('⚠️  MONGO_URI is missing or contains placeholder values (<username>, <password>).');
    console.warn('👉 Please update backend/.env with your actual MongoDB Atlas connection string.');
    return null;
  }

  try {
    cachedPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5-second timeout to avoid long hangs
    });

    const conn = await cachedPromise;
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null; // Reset so subsequent requests can retry
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
