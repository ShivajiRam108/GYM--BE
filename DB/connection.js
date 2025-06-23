const mongoose = require('mongoose');

// Optional: control strict query behavior to avoid warnings in Mongoose 7+
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ramudus684:admin123@cluster0.uwajz9x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1); // Exit process if unable to connect
  }
};

connectDB();

module.exports = mongoose;
