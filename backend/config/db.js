const mongoose = require('mongoose');

// Cache database connection for serverless environments (Vercel)
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI environment variable is missing.');
    console.error('Please create a backend/.env file and set your MongoDB Atlas connection string.');
    console.error('Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/findit?retryWrites=true&w=majority');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Keep timeout reasonable for rapid feedback
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't crash immediately so /api/health can still inform user of db status
    return null;
  }
};

module.exports = connectDB;
