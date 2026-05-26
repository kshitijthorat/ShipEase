const request = require('supertest');
const app = require('../index');
const db = require('./testDb');
const User = require('../models/User');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new customer', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('role', 'customer');
      expect(res.body.data.user.email).toEqual('test@example.com');
    });

    it('should not register user with existing email', async () => {
      await User.create({
        name: 'Existing',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      });
      const res = await request(app).post('/api/auth/register').send({
        name: 'Another',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Email already registered');
    });

    it('should not register with missing required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123'
      });
      // Validation should catch this, it will be 400
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'password123',
        role: 'customer'
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword'
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail login with unregistered email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});
