const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000, // Fail fast (2 seconds)
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`⚠️ MongoDB Connection Failed: ${err.message}`);
    console.log(`🚀 Entering DEMO MODE (In-Memory Simulation)`);
    return false;
  }
};

module.exports = connectDB;
