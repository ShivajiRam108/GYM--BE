const mongoose = require('mongoose');
require('dotenv').config();
// Optional: control strict query behavior to avoid warnings in Mongoose 7+
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb+srv://ramudus684:admin123@cluster0.uwajz9x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await mongoose.connect(process.env.MONGO_URI);

    // await mongoose.connect("mongodb://127.0.0.1:27017/gymBackEnd")
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1); // Exit process if unable to connect
  }
};

connectDB();

module.exports = mongoose;
