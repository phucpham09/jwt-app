// middleware/authMiddleware.js
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const userVerification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    req.userId = user._id; 
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

module.exports = { userVerification };
