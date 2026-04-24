const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');
const { ok } = require('../utils/apiResponse');

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, error: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken({ id: user._id, role: user.role });

  return ok(
    res,
    { user: sanitize(user), token },
    'User registered successfully',
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: 'Invalid credentials' });
  }
  const match = await user.comparePassword(password);
  if (!match) {
    return res
      .status(401)
      .json({ success: false, error: 'Invalid credentials' });
  }
  const token = signToken({ id: user._id, role: user.role });
  return ok(res, { user: sanitize(user), token }, 'Login successful');
});

module.exports = { register, login };
