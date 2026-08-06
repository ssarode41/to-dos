const mongoose = require('mongoose');
const logger = require('./logger');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elitea-todos';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    logger.info('MongoDB connected', { uri });
  } catch (error) {
    logger.warn('MongoDB unavailable, continuing with in-memory fallback', { error: error.message });
  }
}

module.exports = { connectToDatabase };
