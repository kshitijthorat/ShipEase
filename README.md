# ShipEase Backend

Transport Management System API — manages users (customer/driver/manager) and shipments.

## Requirements
- Node.js 18+
- MongoDB (Atlas or local)

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill values:
   - `PORT` (default 5000)
   - `MONGO_URI`
   - `JWT_SECRET` (use a long random string)
   - `CLIENT_URL` (e.g. http://localhost:3000)
3. Run:
   - Dev: `npm run dev`
   - Prod: `npm start`
   - Test: `npm test`

## Response format
- Success: `{ "success": true, "data": ..., "message": "..." }`
- Error:   `{ "success": false, "error": "..." }`

## Endpoints

### Auth
- `POST /api/auth/register` — body: `{ name, email, password, role? }`
- `POST /api/auth/login` — body: `{ email, password }`

### Shipments (require `Authorization: Bearer <token>`)
- `POST /api/shipments` (customer) — body: `{ pickupLocation, deliveryLocation }`
- `GET /api/shipments/my` (customer)
- `GET /api/shipments` (manager)
- `PUT /api/shipments/:id/assign` (manager) — body: `{ driverId }`
- `PUT /api/shipments/:id/accept` (driver)
- `PUT /api/shipments/:id/status` (driver) — body: `{ status: "in-transit" | "delivered" }`

### Role & Access Tests (require `Authorization: Bearer <token>`)
- `GET /api/test/user-only` (any logged-in user)
- `GET /api/test/manager-only` (manager only)
- `GET /api/test/driver-manager` (driver or manager)

## Roles
`customer | driver | manager`

## Notes
- JWT expiry: 7 days.
- Rate limit on `/api/auth/*`: 20 requests / 15 min.
- CORS restricted to `CLIENT_URL`.

## Testing
The backend test setup supports two modes:

- Preferred on restricted environments: real Mongo connection via `TEST_MONGO_URI` (or `MONGO_URI`) with `TEST_DB_NAME=shipease_test`
- Fallback: `mongodb-memory-server` if no test URI is provided

Important safety behavior:
- Test cleanup runs only on the `shipease_test` database by default.
- It refuses to wipe any other DB name.

To execute all 24 unit and integration test cases, simply run:
```bash
npm test
```
