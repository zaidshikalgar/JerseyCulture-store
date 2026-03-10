const mongoose = require('mongoose');

const shouldFallbackToLocal = (error) => {
  const message = String(error?.message || '');
  const code = String(error?.code || '');

  return (
    message.includes('querySrv') ||
    message.includes('ETIMEOUT') ||
    message.includes('ENOTFOUND') ||
    message.includes('ESERVFAIL') ||
    code === 'ETIMEOUT' ||
    code === 'ENOTFOUND'
  );
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const localMongoUri =
    process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/jerseyculture';

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in environment variables.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (mongoUri.startsWith('mongodb+srv://') && shouldFallbackToLocal(error)) {
      console.warn(
        `MongoDB SRV connection failed (${error.message}). Falling back to local MongoDB.`
      );
      const conn = await mongoose.connect(localMongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB connected (local fallback): ${conn.connection.host}`);
      return;
    }

    throw error;
  }
};

module.exports = connectDB;
