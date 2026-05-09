const request = require('supertest');
const app = require('../index');
const db = require('./testDb');
const User = require('../models/User');
const Shipment = require('../models/Shipment');
const { signToken } = require('../utils/token');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Shipment Endpoints', () => {
  let customer1, customer2, manager, driver1, driver2;
  let c1Token, c2Token, mToken, d1Token, d2Token;

  beforeEach(async () => {
    customer1 = await User.create({ name: 'C1', email: 'c1@test.com', password: 'password', role: 'customer', isVerified: true });
    c1Token = signToken({ id: customer1._id, role: customer1.role });

    customer2 = await User.create({ name: 'C2', email: 'c2@test.com', password: 'password', role: 'customer', isVerified: true });
    c2Token = signToken({ id: customer2._id, role: customer2.role });

    manager = await User.create({ name: 'M1', email: 'm1@test.com', password: 'password', role: 'manager', isVerified: true });
    mToken = signToken({ id: manager._id, role: manager.role });

    driver1 = await User.create({ name: 'D1', email: 'd1@test.com', password: 'password', role: 'driver', isVerified: true });
    d1Token = signToken({ id: driver1._id, role: driver1.role });

    driver2 = await User.create({ name: 'D2', email: 'd2@test.com', password: 'password', role: 'driver', isVerified: true });
    d2Token = signToken({ id: driver2._id, role: driver2.role });
  });

  describe('POST /api/shipments', () => {
    it('should allow customer to create a shipment', async () => {
      const res = await request(app).post('/api/shipments')
        .set('Authorization', `Bearer ${c1Token}`)
        .send({ pickupLocation: 'NY', deliveryLocation: 'LA' });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('pickupLocation', 'NY');
      expect(res.body.data.customer).toEqual(customer1._id.toString());
      expect(res.body.data.status).toEqual('pending');
    });

    it('should deny driver from creating shipment', async () => {
      const res = await request(app).post('/api/shipments')
        .set('Authorization', `Bearer ${d1Token}`)
        .send({ pickupLocation: 'NY', deliveryLocation: 'LA' });
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/shipments', () => {
    beforeEach(async () => {
      await Shipment.create({ customer: customer1._id, pickupLocation: 'A', deliveryLocation: 'B' });
    });

    it('should allow manager to view all shipments', async () => {
      const res = await request(app).get('/api/shipments')
        .set('Authorization', `Bearer ${mToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(1);
    });

    it('should deny customer from viewing all shipments', async () => {
      const res = await request(app).get('/api/shipments')
        .set('Authorization', `Bearer ${c1Token}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/shipments/my', () => {
    beforeEach(async () => {
      await Shipment.create({ customer: customer1._id, pickupLocation: 'A', deliveryLocation: 'B' });
      await Shipment.create({ customer: customer2._id, pickupLocation: 'C', deliveryLocation: 'D' });
    });

    it('should allow customer to view only their shipments', async () => {
      const res = await request(app).get('/api/shipments/my')
        .set('Authorization', `Bearer ${c1Token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].pickupLocation).toBe('A');
    });
  });

  describe('PUT /api/shipments/:id/assign', () => {
    let shipment;
    beforeEach(async () => {
      shipment = await Shipment.create({ customer: customer1._id, pickupLocation: 'A', deliveryLocation: 'B' });
    });

    it('should allow manager to assign a driver', async () => {
      const res = await request(app).put(`/api/shipments/${shipment._id}/assign`)
        .set('Authorization', `Bearer ${mToken}`)
        .send({ driverId: driver1._id });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.assignedDriver).toEqual(driver1._id.toString());
      expect(res.body.data.status).toEqual('assigned');
    });

    it('should return 400 if driver is invalid', async () => {
      const res = await request(app).put(`/api/shipments/${shipment._id}/assign`)
        .set('Authorization', `Bearer ${mToken}`)
        .send({ driverId: customer1._id }); // not a driver
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('Driver Actions', () => {
    let shipment;
    beforeEach(async () => {
      shipment = await Shipment.create({ 
        customer: customer1._id, 
        pickupLocation: 'A', 
        deliveryLocation: 'B',
        assignedDriver: driver1._id,
        status: 'assigned'
      });
    });

    describe('PUT /api/shipments/:id/accept', () => {
      it('should allow assigned driver to accept', async () => {
        const res = await request(app).put(`/api/shipments/${shipment._id}/accept`)
          .set('Authorization', `Bearer ${d1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('in-transit');
      });

      it('should deny unassigned driver', async () => {
        const res = await request(app).put(`/api/shipments/${shipment._id}/accept`)
          .set('Authorization', `Bearer ${d2Token}`);
        expect(res.statusCode).toEqual(403);
      });
    });

    describe('PUT /api/shipments/:id/status', () => {
      beforeEach(async () => {
        shipment.status = 'in-transit';
        await shipment.save();
      });

      it('should allow driver to mark delivered from in-transit', async () => {
        const res = await request(app).put(`/api/shipments/${shipment._id}/status`)
          .set('Authorization', `Bearer ${d1Token}`)
          .send({ status: 'delivered' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('delivered');
      });

      it('should prevent invalid status transition', async () => {
        const res = await request(app).put(`/api/shipments/${shipment._id}/status`)
          .set('Authorization', `Bearer ${d1Token}`)
          .send({ status: 'pending' }); // invalid transition
        expect(res.statusCode).toEqual(400);
      });
    });
  });
});
