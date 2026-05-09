// middleware/authMiddleware.js

const User = require("../models/User");
const { verifyToken } = require("../utils/token");
const asyncHandler = require("../utils/asyncHandler");


// PROTECT ROUTES
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No Token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized, token missing",
    });
  }

  try {
    // Verify JWT
    const decoded = verifyToken(token);

    // Find User
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User no longer exists",
      });
    }

    // Check Email Verification
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: "User email is not verified",
      });
    }

    // Attach User to Request
    req.user = user;

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      error: "Not authorized, token invalid",
    });
  }
});


// ROLE AUTHORIZATION
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' is not allowed`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};