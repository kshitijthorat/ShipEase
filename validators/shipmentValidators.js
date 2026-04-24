const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const createShipmentSchema = z.object({
  body: z.object({
    pickupLocation: z.string().min(1, 'pickupLocation is required'),
    deliveryLocation: z.string().min(1, 'deliveryLocation is required'),
  }),
});

const assignDriverSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ driverId: objectId }),
});

const shipmentIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

const updateStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(['in-transit', 'delivered']),
  }),
});

module.exports = {
  createShipmentSchema,
  assignDriverSchema,
  shipmentIdParamSchema,
  updateStatusSchema,
};
