const request = require('supertest');
const app = require('../index');
const db = require('./testDb');
const User = require('../models/User');
const { signToken } = require('../utils/token');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Protected Routes', () => {
  let customerToken, managerToken, driverToken;

  beforeEach(async () => {
    const customer = await User.create({ name: 'Customer', email: 'cust@test.com', password: 'password', role: 'customer' });
    customerToken = signToken({ id: customer._id, role: customer.role });

    const manager = await User.create({ name: 'Manager', email: 'mgr@test.com', password: 'password', role: 'manager' });
    managerToken = signToken({ id: manager._id, role: manager.role });

    const driver = await User.create({ name: 'Driver', email: 'drv@test.com', password: 'password', role: 'driver' });
    driverToken = signToken({ id: driver._id, role: driver.role });
  });

  describe('GET /api/test/user-only', () => {
    it('should allow any authenticated user', async () => {
      const res = await request(app).get('/api/test/user-only')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.role).toEqual('customer');
    });

    it('should deny unauthenticated requests', async () => {
      const res = await request(app).get('/api/test/user-only');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/test/manager-only', () => {
    it('should allow manager', async () => {
      const res = await request(app).get('/api/test/manager-only')
        .set('Authorization', `Bearer ${managerToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should deny customer', async () => {
      const res = await request(app).get('/api/test/manager-only')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/test/driver-manager', () => {
    it('should allow driver', async () => {
      const res = await request(app).get('/api/test/driver-manager')
        .set('Authorization', `Bearer ${driverToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should allow manager', async () => {
      const res = await request(app).get('/api/test/driver-manager')
        .set('Authorization', `Bearer ${managerToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should deny customer', async () => {
      const res = await request(app).get('/api/test/driver-manager')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});
