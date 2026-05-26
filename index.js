// server.js

// =======================================
// LOAD ENV
// =======================================
if (process.env.NODE_ENV !== "test") {

  require("dotenv").config();
}

// =======================================
// IMPORTS
// =======================================
const express =
  require("express");

const cors =
  require("cors");

const helmet =
  require("helmet");

const morgan =
  require("morgan");

const rateLimit =
  require("express-rate-limit");

// DB
const connectDB =
  require("./config/db");

// ROUTES
const apiRoutes =
  require("./routes");

const bookingRoutes =
  require("./routes/bookingRoutes");

const userRoutes =
  require("./routes/userRoutes");

// MIDDLEWARE
const {

  notFound,

  errorHandler,

} = require(
  "./middleware/errorMiddleware"
);

// =======================================
// APP
// =======================================
const app =
  express();

// =======================================
// ALLOWED ORIGINS
// =======================================
const allowedOrigins =
  (
    process.env.CLIENT_URL || ""
  )

    .split(",")

    .map((origin) =>
      origin.trim()
    )

    .filter(Boolean);

// =======================================
// CORE MIDDLEWARE
// =======================================
app.use(
  helmet()
);

app.use(
  express.json()
);

app.use(

  cors({

    origin(
      origin,
      callback
    ) {

      if (!origin) {

        return callback(
          null,
          true
        );
      }

      if (

        allowedOrigins.length ===
          0 ||

        allowedOrigins.includes(
          origin
        ) ||

        /^http:\/\/localhost:\d+$/.test(
          origin
        )
      ) {

        return callback(
          null,
          true
        );
      }

      return callback(

        new Error(
          "Not allowed by CORS"
        )
      );
    },

    credentials: true,
  })
);

// =======================================
// LOGGER
// =======================================
if (
  process.env.NODE_ENV !==
  "test"
) {

  app.use(
    morgan("dev")
  );
}

// =======================================
// AUTH RATE LIMITER
// =======================================
const authLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

      success: false,

      error:
        "Too many requests, please try again later",
    },
  });

// =======================================
// APPLY RATE LIMITER
// =======================================
app.use(
  "/api/auth",
  authLimiter
);

// =======================================
// HEALTH CHECK
// =======================================
app.get(
  "/",

  (req, res) => {

    res.json({

      success: true,

      data: {

        name:
          "ShipEase API",

        status: "ok",
      },

      message:
        "API running",
    });
  }
);

// =======================================
// API ROUTES
// =======================================
app.use(
  "/api",
  apiRoutes
);

// BOOKINGS
app.use(
  "/api/bookings",
  bookingRoutes
);

// USERS / DRIVERS
app.use(
  "/api/users",
  userRoutes
);

// =======================================
// 404 HANDLER
// =======================================
app.use(
  notFound
);

// =======================================
// ERROR HANDLER
// =======================================
app.use(
  errorHandler
);

// =======================================
// PORT
// =======================================
const PORT =
  process.env.PORT ||
  5000;

// =======================================
// START SERVER
// =======================================
if (
  process.env.NODE_ENV !==
  "test"
) {

  connectDB()

    .then(() => {

      app.listen(
        PORT,

        () => {

          console.log(

            `Server running on port ${PORT}`
          );
        }
      );
    })

    .catch((err) => {

      console.error(

        "Failed to connect to DB",

        err
      );

      process.exit(1);
    });
}

module.exports =
  app;