const express =
  require("express");

const router =
  express.Router();

const User =
  require("../models/User");

// =======================================
// CREATE DRIVER
// =======================================
router.post(

  "/create-driver",

  async (req, res) => {

    try {

      const {

        name,
        email,
        password,
        phone,
        vehicleType,
        vehicleNumber,
        licenseNumber,

      } = req.body;

      // CHECK EXISTING USER
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "Driver already exists",
        });
      }

      // CREATE DRIVER
      const driver =
        await User.create({

          name,

          email,

          password,

          phone,

          vehicleType,

          vehicleNumber,

          licenseNumber,

          role: "driver",

          isVerified: true,
        });

      res.status(201).json({

        success: true,

        message:
          "Driver created successfully",

        driver,
      });

    } catch (error) {

      console.log(
        "CREATE DRIVER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to create driver",
      });
    }
  }
);

// =======================================
// GET ALL DRIVERS
// =======================================
router.get(

  "/drivers",

  async (req, res) => {

    try {

      const drivers =
        await User.find({

          role: "driver",
        });

      res.status(200).json({

        success: true,

        drivers,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch drivers",
      });
    }
  }
);

module.exports =
  router;