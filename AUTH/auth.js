const jwt = require("jsonwebtoken");
const Gym = require("../MODELS/GYM");

const auth = async (req, res, next) => {
  try {
    // const rawToken = req.cookies.token;

    //   if (!rawToken || !rawToken.startsWith("Bearer ")) {
    //   return res.status(401).json({message: "Unauthorized: Token missing"})
    // }
    
    const token = req.cookies.token || req.headers.Authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
    

 
    // If you stored "Bearer <token>", remove "Bearer "
    // const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const gym = await Gym.findById(decoded.gym_id).select("-password");
    if (!gym) return res.status(401).json({ error: "Unauthorized: Gym not found"});

    req.gym = gym
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: invalid token" });
  }
};

module.exports = auth;
