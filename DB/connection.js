const mongoose = require('mongoose');

// Optional: control strict query behavior to avoid warnings in Mongoose 7+
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/gymBackEnd');
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1); // Exit process if unable to connect
  }
};

connectDB();

module.exports = mongoose;
