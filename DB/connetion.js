const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/gymBackEnd', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection failed", err));

module.exports = mongoose;