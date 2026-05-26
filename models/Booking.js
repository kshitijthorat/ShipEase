// models/Booking.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(

  {

    // =======================================
    // CUSTOMER
    // =======================================
    user: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      // TEMPORARY FALSE
      // UNTIL AUTH IS ENABLED
      required: false,
    },

    // =======================================
    // DRIVER
    // =======================================
    driver: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    // =======================================
    // PICKUP
    // =======================================
    pickupAddress: {

      type: String,

      required: true,

      trim: true,
    },

    pickupCoordinates: {

      lat: Number,

      lng: Number,
    },

    // =======================================
    // DROP
    // =======================================
    dropAddress: {

      type: String,

      required: true,

      trim: true,
    },

    dropCoordinates: {

      lat: Number,

      lng: Number,
    },

    // =======================================
    // VEHICLE
    // =======================================
    vehicleType: {

      type: String,

      enum: [
        "Two Wheeler",
  "Mini Truck",
  "Truck",
  "Packers & Movers",
      ],

      required: true,
    },

    // =======================================
    // GOODS
    // =======================================
    goodsType: {

      type: String,

      default: "",
    },

    // IMPORTANT FIX
    // STRING INSTEAD OF NUMBER
    goodsWeight: {

      type: String,

      default: "",
    },

    // =======================================
    // PRICING
    // =======================================
    estimatedFare: {

      type: Number,

      required: true,
    },

    finalFare: {

      type: Number,

      default: 0,
    },

    distance: {

      type: Number,

      default: 0,
    },

    duration: {

      type: Number,

      default: 0,
    },

    // =======================================
    // STATUS
    // =======================================
    status: {

      type: String,

      enum: [

        "Pending",

        "Confirmed",

        "Accepted",

        "Driver Assigned",

        "Picked Up",

        "In Transit",

        "Delivered",

        "Cancelled",
      ],

      default: "Confirmed",
    },

    // =======================================
    // PAYMENT
    // =======================================
    paymentMethod: {

      type: String,

      enum: [
        "Cash",
        "Online",
      ],

      default: "Cash",
    },

    paymentStatus: {

      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],

      default: "Pending",
    },

    // =======================================
    // TRACKING
    // =======================================
    trackingId: {

      type: String,

      unique: true,
    },

    // =======================================
    // NOTES
    // =======================================
    notes: {

      type: String,

      default: "",
    },

    // =======================================
    // SCHEDULE
    // =======================================
    scheduledAt: {

      type: Date,

      default: null,
    },

    deliveredAt: {

      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =======================================
// AUTO GENERATE TRACKING ID
// =======================================
// AUTO GENERATE TRACKING ID
bookingSchema.pre(
  "save",

  function () {

    if (!this.trackingId) {

      this.trackingId =

        "SE" +

        Math.floor(
          100000 +
          Math.random() * 900000
        );
    }
  }
);

module.exports =
  mongoose.model(
    "Booking",
    bookingSchema
  );