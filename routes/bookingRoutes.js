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
router.post("/create", async (req, res) => {

  try {

    console.log(
      "REQ BODY:",
      req.body
    );

    const {

      user,

      pickupAddress,

      // =======================================
      // PICKUP COORDINATES
      // =======================================
      pickupCoordinates,

      dropAddress,

      // =======================================
      // DROP COORDINATES
      // =======================================
      dropCoordinates,

      vehicleType,

      goodsType,

      goodsWeight,

      estimatedFare,

      distance,

      duration,

      paymentMethod,

      notes,

      scheduledAt,

    } = req.body;

    // =======================================
    // VALIDATION
    // =======================================
    if (
      !pickupAddress ||
      !dropAddress ||
      !vehicleType
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Missing required fields",
      });
    }

    // =======================================
    // CREATE BOOKING
    // =======================================
    const booking =
      await Booking.create({

        user,

        pickupAddress,

        // =======================================
        // SAVE PICKUP COORDINATES
        // =======================================
        pickupCoordinates,

        dropAddress,

        // =======================================
        // SAVE DROP COORDINATES
        // =======================================
        dropCoordinates,

        vehicleType,

        goodsType,

        goodsWeight,

        estimatedFare,

        finalFare:
          estimatedFare,

        distance,

        duration,

        paymentMethod,

        notes,

        scheduledAt,

        status:
          "Confirmed",

        paymentStatus:
          "Pending",
      });

    // =======================================
    // RESPONSE
    // =======================================
    res.status(201).json({

      success: true,

      message:
        "Booking created successfully",

      booking,
    });

  } catch (error) {

    console.log(
      "Create Booking Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
});


// =======================================
// GET ALL BOOKINGS
// =======================================
router.get("/", async (req, res) => {

  try {

    const bookings =
      await Booking.find()

        .sort({
          createdAt: -1,
        });

    res.status(200).json({

      success: true,

      bookings,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch bookings",
    });
  }
});


// =======================================
// GET AVAILABLE BOOKINGS FOR DRIVERS
// =======================================
router.get(

  "/available/all",

  async (req, res) => {

    try {

      const bookings =
        await Booking.find({

          status: {
            $in: [
              "Confirmed",
              "Pending",
            ],
          },

          driver: null,
        })

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        bookings,
      });

    } catch (error) {

      console.log(
        "Available Bookings Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch available bookings",
      });
    }
  }
);


// =======================================
// GET USER BOOKINGS
// =======================================
router.get(

  "/my-bookings",

  protect,

  async (req, res) => {

    try {

      const bookings =
        await Booking.find({

          user:
            req.user._id,
        })

          .populate(
            "driver",
            "name email"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        bookings,
      });

    } catch (error) {

      console.log(
        "Get Bookings Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch bookings",
      });
    }
  }
);


// =======================================
// GET SINGLE BOOKING
// =======================================
router.get(

  "/:id",

  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        )

          .populate(
            "user",
            "name email"
          )

          .populate(
            "driver",
            "name email"
          );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      res.status(200).json({

        success: true,

        booking,
      });

    } catch (error) {

      console.log(
        "Get Single Booking Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch booking",
      });
    }
  }
);


// =======================================
// UPDATE BOOKING STATUS
// =======================================
router.put(

  "/status/:id",

  async (req, res) => {

    try {

      const { status } =
        req.body;

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      booking.status =
        status;

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          "Booking status updated",

        booking,
      });

    } catch (error) {

      console.log(
        "Update Status Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to update booking status",
      });
    }
  }
);


// =======================================
// DRIVER ACCEPT BOOKING
// =======================================
router.put(

  "/accept/:id",

  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      // =======================================
      // UPDATE BOOKING
      // =======================================
      booking.status =
        "Accepted";

      // =======================================
      // TEMP DRIVER ASSIGNMENT
      // =======================================
      booking.driver =
        "681ff9a2f2b9c93a61c7a111";

      await booking.save();

      // =======================================
      // RESPONSE
      // =======================================
      res.status(200).json({

        success: true,

        message:
          "Booking accepted successfully",

        booking,
      });

    } catch (error) {

      console.log(
        "Accept Booking Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to accept booking",
      });
    }
  }
);


// =======================================
// UPDATE BOOKING
// =======================================
router.put(

  "/:id",

  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      const {

        goodsType,

        goodsWeight,

        notes,

        scheduledAt,

        status,
      } = req.body;

      if (
        goodsType !== undefined
      ) {

        booking.goodsType =
          goodsType;
      }

      if (
        goodsWeight !== undefined
      ) {

        booking.goodsWeight =
          goodsWeight;
      }

      if (
        notes !== undefined
      ) {

        booking.notes =
          notes;
      }

      if (
        scheduledAt !== undefined
      ) {

        booking.scheduledAt =
          scheduledAt;
      }

      if (
        status !== undefined
      ) {

        booking.status =
          status;
      }

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          "Booking updated successfully",

        booking,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to update booking",
      });
    }
  }
);


// =======================================
// DELETE BOOKING
// =======================================
router.delete(

  "/:id",

  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      await booking.deleteOne();

      res.status(200).json({

        success: true,

        message:
          "Booking deleted successfully",
      });

    } catch (error) {

      console.log(
        "Delete Booking Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to delete booking",
      });
    }
  }
);
// =======================================
// ASSIGN DRIVER
// =======================================
router.put(

  "/assign/:id",

  async (req, res) => {

    try {

      const {
        driverId,
      } = req.body;

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      booking.driver =
        driverId;

      booking.status =
        "Driver Assigned";

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          "Driver assigned successfully",

        booking,
      });

    } catch (error) {

      console.log(
        "Assign Driver Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to assign driver",
      });
    }
  }
);
// =======================================
// GET DRIVER BOOKINGS
// =======================================
router.get(

  "/driver/:driverId",

  async (req, res) => {

    try {

      const bookings =
        await Booking.find({

          driver:
            req.params.driverId,
        })

        .populate(
          "user",
          "name email"
        )

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        bookings,
      });

    } catch (error) {

      console.log(
        "Driver Bookings Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch driver bookings",
      });
    }
  }
);
// =======================================
// UPDATE DRIVER BOOKING STATUS
// =======================================
router.put(

  "/update-status/:id",

  async (req, res) => {

    try {

      const {
        status,
      } = req.body;

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",
        });
      }

      booking.status =
        status;

      // =======================================
      // AUTO DELIVERY DATE
      // =======================================
      if (
        status ===
        "Delivered"
      ) {

        booking.deliveredAt =
          new Date();
      }

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          "Booking status updated successfully",

        booking,
      });

    } catch (error) {

      console.log(
        "Update Driver Status Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to update booking status",
      });
    }
  }
);

module.exports = router;