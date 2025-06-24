const jwt = require("jsonwebtoken");
const Gym = require("../MODELS/GYM");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({ error: "No token, unauthorized" });
    }

    // If you stored "Bearer <token>", remove "Bearer "
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);

    const gym = await Gym.findById(decoded.gym_id).select("-password");
    if (!gym) return res.status(401).json({ error: "Invalid gym" });

    req.gym = gym;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};

module.exports = auth;
