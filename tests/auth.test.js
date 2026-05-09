const request = require('supertest');
const app = require('../index');
const db = require('./testDb');
const User = require('../models/User');
const {
  clearSentOtps,
  getLastSentOtpForEmail,
} = require('../services/emailService');

beforeAll(async () => await db.connect());
afterEach(async () => {
  clearSentOtps();
  await db.clearDatabase();
});
afterAll(async () => await db.closeDatabase());

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new customer, save OTP data in MongoDB, and require verification', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).not.toHaveProperty('token');
      expect(res.body.data.verificationRequired).toBe(true);
      expect(res.body.data.user).toHaveProperty('role', 'customer');
      expect(res.body.data.user).toHaveProperty('isVerified', false);

      const savedUser = await User.findOne({ email: 'test@example.com' }).select(
        '+otpCodeHash +otpExpiresAt'
      );
      expect(savedUser).toBeTruthy();
      expect(savedUser.isVerified).toBe(false);
      expect(savedUser.otpCodeHash).toBeTruthy();
      expect(savedUser.otpExpiresAt).toBeTruthy();
      expect(savedUser.otpLastSentAt).toBeTruthy();
      expect(getLastSentOtpForEmail('test@example.com')).toMatch(/^\d{6}$/);
    });

    it('should not register user with existing email', async () => {
      await User.create({
        name: 'Existing',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
      });
      const res = await request(app).post('/api/auth/register').send({
        name: 'Another',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Email already registered');
    });
  });

  describe('OTP verification flow', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'password123',
        role: 'customer',
      });
    });

    it('should block login until the email is verified', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Email verification required before login');
    });

    it('should verify OTP, update MongoDB, and issue JWT', async () => {
      const otp = getLastSentOtpForEmail('login@example.com');

      const res = await request(app).post('/api/auth/verify-otp').send({
        email: 'login@example.com',
        otp,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('isVerified', true);

      const verifiedUser = await User.findOne({ email: 'login@example.com' }).select(
        '+otpCodeHash +otpExpiresAt'
      );
      expect(verifiedUser.isVerified).toBe(true);
      expect(verifiedUser.verifiedAt).toBeTruthy();
      expect(verifiedUser.otpCodeHash).toBeNull();
      expect(verifiedUser.otpExpiresAt).toBeNull();
      expect(verifiedUser.otpAttempts).toBe(0);
    });

    it('should reject invalid OTP and increment attempt count in MongoDB', async () => {
      const res = await request(app).post('/api/auth/verify-otp').send({
        email: 'login@example.com',
        otp: '000000',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid OTP');

      const user = await User.findOne({ email: 'login@example.com' });
      expect(user.otpAttempts).toBe(1);
      expect(user.isVerified).toBe(false);
    });

    it('should resend OTP and update stored OTP metadata in MongoDB', async () => {
      const before = await User.findOne({ email: 'login@example.com' }).select(
        '+otpCodeHash +otpExpiresAt'
      );

      before.otpLastSentAt = new Date(Date.now() - 5 * 60 * 1000);
      await before.save();

      const res = await request(app).post('/api/auth/resend-otp').send({
        email: 'login@example.com',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationRequired).toBe(true);

      const after = await User.findOne({ email: 'login@example.com' }).select(
        '+otpCodeHash +otpExpiresAt'
      );
      expect(after.otpCodeHash).toBeTruthy();
      expect(after.otpExpiresAt).toBeTruthy();
      expect(after.otpLastSentAt).toBeTruthy();
      expect(after.otpCodeHash).not.toEqual(before.otpCodeHash);
      expect(getLastSentOtpForEmail('login@example.com')).toMatch(/^\d{6}$/);
    });

    it('should login successfully after verification', async () => {
      const otp = getLastSentOtpForEmail('login@example.com');
      await request(app).post('/api/auth/verify-otp').send({
        email: 'login@example.com',
        otp,
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('isVerified', true);
    });
  });
});
