const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');
const { ok } = require('../utils/apiResponse');
const {
  generateOtp,
  getOtpExpiryDate,
  hashOtp,
  isOtpExpired,
} = require('../utils/otp');
const { sendOtpEmail } = require('../services/emailService');

const OTP_RESEND_COOLDOWN_MS = Number(
  process.env.OTP_RESEND_COOLDOWN_MS || 60 * 1000
);
const MAX_OTP_ATTEMPTS = Number(process.env.MAX_OTP_ATTEMPTS || 5);

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

const attachOtpToUser = async (user) => {
  const otp = generateOtp();
  user.otpCodeHash = hashOtp(otp);
  user.otpExpiresAt = getOtpExpiryDate();
  user.otpLastSentAt = new Date();
  user.otpAttempts = 0;
  await user.save();

  await sendOtpEmail({
    email: user.email,
    name: user.name,
    otp,
  });

  return otp;
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, error: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role });
  try {
    await attachOtpToUser(user);
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }

  return ok(
    res,
    {
      user: sanitize(user),
      verificationRequired: true,
    },
    'User registered successfully. Verification OTP sent to email.',
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
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required before login',
    });
  }
  const token = signToken({ id: user._id, role: user.role });
  return ok(res, { user: sanitize(user), token }, 'Login successful');
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select(
    '+password +otpCodeHash +otpExpiresAt'
  );

  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: 'User not found' });
  }

  if (user.isVerified) {
    const token = signToken({ id: user._id, role: user.role });
    return ok(res, { user: sanitize(user), token }, 'User already verified');
  }

  if (!user.otpCodeHash || !user.otpExpiresAt || isOtpExpired(user.otpExpiresAt)) {
    return res.status(400).json({
      success: false,
      error: 'OTP expired. Please request a new code.',
    });
  }

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many invalid OTP attempts. Please request a new code.',
    });
  }

  if (hashOtp(otp) !== user.otpCodeHash) {
    user.otpAttempts += 1;
    await user.save();
    return res.status(400).json({
      success: false,
      error: 'Invalid OTP',
    });
  }

  user.isVerified = true;
  user.verifiedAt = new Date();
  user.otpCodeHash = null;
  user.otpExpiresAt = null;
  user.otpLastSentAt = null;
  user.otpAttempts = 0;
  await user.save();

  const token = signToken({ id: user._id, role: user.role });
  return ok(
    res,
    { user: sanitize(user), token },
    'Email verified successfully'
  );
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+otpCodeHash +otpExpiresAt');

  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      error: 'User is already verified',
    });
  }

  if (
    user.otpLastSentAt &&
    Date.now() - new Date(user.otpLastSentAt).getTime() < OTP_RESEND_COOLDOWN_MS
  ) {
    return res.status(429).json({
      success: false,
      error: 'Please wait before requesting another OTP',
    });
  }

  await attachOtpToUser(user);

  return ok(
    res,
    {
      user: sanitize(user),
      verificationRequired: true,
    },
    'A new OTP has been sent to your email'
  );
});

module.exports = { register, login, verifyOtp, resendOtp };
