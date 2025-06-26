const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3002;

// CORS Configuration
app.use(cors({
  // origin: "http://localhost:5173",
  origin : "https://gym-fe.vercel.app",
  // origin : "gym-ms.netlify.app",
  withCredentials: true,
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());


// Connect to Database
require("./DB/connection"); 

// Import Routes
const GymRoutes = require("./Routes/gym");
const MembershipRoutes = require("./Routes/membership");
const MemberRoutes = require("./Routes/member");

// Use Routes
app.use("/auth", GymRoutes);
app.use("/plans", MembershipRoutes);
app.use("/members", MemberRoutes);

// Health Check Route (Optional)
app.get("/", (req, res) => {
  res.send({ message: "✅ Server is running successfully." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
