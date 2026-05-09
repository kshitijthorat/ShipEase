// routes/bookingRoutes.js

const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");


// =======================================
// CREATE BOOKING
// =======================================
router.post("/create", protect, async (req, res) => {
  try {
    const {
      pickupAddress,
      dropAddress,
      pickupCoordinates,
      dropCoordinates,
      vehicleType,
      goodsType,
      estimatedFare,
      distance,
      paymentMethod,
      notes,
    } = req.body;

    const booking = await Booking.create({
      user: req.user._id,

      pickupAddress,
      dropAddress,

      pickupCoordinates,
      dropCoordinates,

      vehicleType,
      goodsType,

      estimatedFare,
      distance,

      paymentMethod,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
});


// =======================================
// GET USER BOOKINGS
// =======================================
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("driver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Get Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
});


// =======================================
// GET SINGLE BOOKING
// =======================================
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("driver", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.log("Get Single Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
});


// =======================================
// UPDATE BOOKING STATUS
// =======================================
router.put(
  "/status/:id",
  protect,
  authorize("driver", "manager"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      booking.status = status;

      await booking.save();

      res.status(200).json({
        success: true,
        message: "Booking status updated",
        booking,
      });
    } catch (error) {
      console.log("Update Status Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update booking status",
      });
    }
  }
);


// =======================================
// DRIVER ACCEPT BOOKING
// =======================================
router.put(
  "/accept/:id",
  protect,
  authorize("driver"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      booking.driver = req.user._id;
      booking.status = "Accepted";

      await booking.save();

      res.status(200).json({
        success: true,
        message: "Booking accepted successfully",
        booking,
      });
    } catch (error) {
      console.log("Accept Booking Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to accept booking",
      });
    }
  }
);


// =======================================
// DELETE BOOKING
// =======================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.log("Delete Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
});

module.exports = router;