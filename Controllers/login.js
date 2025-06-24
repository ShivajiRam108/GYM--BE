const jwt = require("jsonwebtoken");

// Inside login or register controller
const token = jwt.sign({ gym_id: gym._id }, process.env.JWT_SECRET_KEY, {
  expiresIn: "7d",
});

res.cookie("token", `Bearer ${token}`, {
  httpOnly: true,
  secure: true,        // Set to true in production with HTTPS
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

res.status(200).json({
  message: "Login successful",
  gym: gym,
});
