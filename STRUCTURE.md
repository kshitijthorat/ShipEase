# Backend File Structure

This file documents the current Backend directory layout, short descriptions, and the Frontend ↔ Backend workflow mapping.

Backend/
├─ index.js                # Server entry: mounts `/api` and `/api/bookings`, starts server and connects DB
├─ package.json            # Node dependencies and scripts
├─ README.md
├─ config/
│  └─ db.js                # DB connection and configuration
├─ controllers/
│  ├─ authController.js    # Handlers for authentication (register, login, verify OTP, resend OTP)
│  └─ (other controllers)  # Add controllers here for bookings, users, etc. if needed
├─ docs/
│  ├─ PRD.md
│  └─ PROJECT.md
├─ middleware/
│  ├─ authMiddleware.js    # `protect` and `authorize` helpers for route protection
│  ├─ errorMiddleware.js   # notFound + errorHandler
│  ├─ roleMiddleware.js    # role-based access helpers
│  └─ validate.js          # request validation wrapper
├─ models/
│  ├─ Booking.js           # Booking schema/model
│  └─ User.js              # User schema/model
├─ routes/
│  ├─ authRoutes.js        # `/api/auth/*` endpoints
│  ├─ bookingRoutes.js     # `/api/bookings/*` endpoints (create, fetch, update, delete)
│  ├─ debugRoutes.js       # development-only debug endpoints
│  ├─ index.js             # mounts auth, booking, debug and other route groups
│  └─ protectedRoutes.js   # sample protected/dev routes
├─ services/
│  └─ emailService.js      # email sending helpers
├─ tests/
│  ├─ auth.test.js
│  ├─ protected.test.js
│  ├─ setupEnv.js
│  ├─ shipment.test.js
│  └─ testDb.js
├─ utils/
│  ├─ apiResponse.js       # standardized API response shapes
│  ├─ asyncHandler.js      # async wrapper for controllers
│  ├─ otp.js               # OTP generation/verification helpers
│  └─ token.js             # JWT helpers
└─ validators/
    ├─ authValidators.js   # Joi/schema validators for auth
    └─ bookingValidators.js# Validators for booking payloads

## Notes
- Keep this file updated when files are added/removed.
- The API base in development is `http://localhost:5000/api`.

---

## Frontend ↔ Backend Workflow Mapping

This section maps frontend pages (Frontend/src/pages) to the backend endpoints they call, with the expected behavior. Use this as a reference when changing UI flows or backend routes.

- `src/pages/Login.jsx`:
   - Calls: `POST /api/auth/login`
   - Purpose: Authenticate user, receive token / session.

- `src/pages/Register.jsx`:
   - Calls: `POST /api/auth/register` -> then `POST /api/auth/verify-otp` (and `POST /api/auth/resend-otp` if needed)
   - Purpose: Create user account and verify via OTP.

- `src/pages/VerifyOtp.jsx`:
   - Calls: `POST /api/auth/verify-otp`, `POST /api/auth/resend-otp`
   - Purpose: Confirm registration or phone/email verification flows.

- `src/pages/BookingPage.jsx`:
   - Typically prepares route data (pickup/drop, coords, distance, vehicle selection) in UI.
   - Does not directly POST by default; acts as the booking builder UI used before confirming on `BookingDetailsPage`.

- `src/pages/BookingDetailsPage.jsx`:
   - Calls: `POST /api/bookings/create` (frontend currently posts to `http://localhost:5000/api/bookings/create`)
   - After success: navigates to `/mybookingsdashboard` (the dashboard page that lists user bookings).
   - Also note: booking details can be loaded via `GET /api/bookings/:id` if you add direct booking-detail deep links.

- `src/pages/Dashboard.jsx` (or `mybookingsdashboard` route):
   - Calls: `GET /api/bookings/my-bookings` to fetch bookings for authenticated user.
   - Admin/driver views may call: `GET /api/bookings` (all bookings) or `GET /api/bookings/available/all` (available for drivers).

- Driver / Operator actions (if exposed in UI):
   - Accept booking: `PUT /api/bookings/accept/:id`
   - Update status: `PUT /api/bookings/status/:id` (body `{ status: "<new-status>" }`)
   - Assign driver: `PUT /api/bookings/assign/:id` (body `{ driverId }`)
   - Update booking details: `PUT /api/bookings/:id`
   - Delete booking: `DELETE /api/bookings/:id`

## Quick Reference
- API base: `http://localhost:5000/api`
- Auth group: `/api/auth/*` (`/register`, `/login`, `/verify-otp`, `/resend-otp`)
- Booking group: `/api/bookings/*` (`/create`, `/`, `/available/all`, `/my-bookings`, `/:id`, `/status/:id`, `/accept/:id`, `/assign/:id`, `/:id` [PUT], `/:id` [DELETE])

If you want, I can also:
- expand each mapping with example request/response payloads,
- add a diagram or quick sequence for the booking flow,
- or create a `Frontend/README.md` snippet with the same mappings.
