const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);

const generateOtp = () =>
  crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(String(otp)).digest('hex');

const getOtpExpiryDate = () =>
  new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

const isOtpExpired = (date) => !date || date.getTime() < Date.now();

module.exports = {
  OTP_TTL_MINUTES,
  generateOtp,
  hashOtp,
  getOtpExpiryDate,
  isOtpExpired,
};
