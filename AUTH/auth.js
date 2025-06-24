const jwt = require("jsonwebtoken");
const Gym = require("../MODELS/GYM");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "No token, unauthorized" });
    }

    
    const pureToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(pureToken, process.env.JWT_SECRET_KEY);

    req.gym = await Gym.findById(decoded.gym_id).select("-password");

    if (!req.gym) {
      return res.status(401).json({ error: "Invalid gym" });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized, invalid token" });
  }
};

module.exports = auth;
