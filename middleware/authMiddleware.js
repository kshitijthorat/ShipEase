const User = require('../models/User');
const { verifyToken } = require('../utils/token');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, error: 'Not authorized, token missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, error: 'Not authorized, token invalid' });
  }
});

module.exports = { protect };
