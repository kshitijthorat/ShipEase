const express = require('express');
const { getLastSentOtpForEmail } = require('../services/emailService');
const User = require('../models/User');

const router = express.Router();

// Development-only: return last OTP stored in memory for an email
router.get('/otp', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: 'Not allowed' });
  }
  const { email } = req.query;
  if (!email) return res.status(400).json({ success: false, error: 'email query required' });

  const otp = getLastSentOtpForEmail(email);
  const user = await User.findOne({ email }).select('-password');

  return res.json({ success: true, otp: otp || null, user: user || null });
});

module.exports = router;
