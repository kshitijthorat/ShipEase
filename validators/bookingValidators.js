// validators/bookingValidation.js

const { z } = require("zod");


// =======================================
// COMMON
// =======================================
const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");


// =======================================
// CREATE BOOKING
// =======================================
const createBookingSchema = z.object({
  body: z.object({

    pickupAddress: z
      .string()
      .min(3, "Pickup address is required"),

    dropAddress: z
      .string()
      .min(3, "Drop address is required"),

    pickupCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),

    dropCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),

    vehicleType: z.enum([
      "Bike",
      "Mini Truck",
      "Truck",
      "Packers & Movers",
    ]),

    goodsType: z
      .string()
      .optional(),

    goodsWeight: z
      .number()
      .optional(),

    estimatedFare: z
      .number()
      .positive("Fare must be positive"),

    distance: z
      .number()
      .optional(),

    duration: z
      .number()
      .optional(),

    paymentMethod: z.enum([
      "Cash",
      "Online",
    ]),

    notes: z
      .string()
      .optional(),

    scheduledAt: z
      .string()
      .datetime()
      .optional(),
  }),
});


// =======================================
// GET SINGLE BOOKING
// =======================================
const bookingIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});


// =======================================
// ASSIGN DRIVER
// =======================================
const assignDriverSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    driverId: objectId,
  }),
});


// =======================================
// UPDATE BOOKING STATUS
// =======================================
const updateBookingStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    status: z.enum([
      "Pending",
      "Accepted",
      "Driver Assigned",
      "Picked Up",
      "In Transit",
      "Delivered",
      "Cancelled",
    ]),
  }),
});


// =======================================
// UPDATE PAYMENT STATUS
// =======================================
const updatePaymentStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    paymentStatus: z.enum([
      "Pending",
      "Paid",
      "Failed",
    ]),
  }),
});


module.exports = {
  createBookingSchema,
  bookingIdParamSchema,
  assignDriverSchema,
  updateBookingStatusSchema,
  updatePaymentStatusSchema,
};