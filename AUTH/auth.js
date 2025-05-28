const Gym = require("../MODELS/GYM");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.cookie_token;
    
    if (!token) {
      return res.status(401).json({ error: "No token, Unauthorized access" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.gym = await Gym.findById(decode.gym_id).select("-password");

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized access Or Token is not valid." });
  }
};

module.exports = auth;
