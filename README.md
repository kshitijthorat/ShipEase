<<<<<<< HEAD
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

## Roles
`customer | driver | manager`

## Notes
- JWT expiry: 7 days.
- Rate limit on `/api/auth/*`: 20 requests / 15 min.
- CORS restricted to `CLIENT_URL`.
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 3f6fb4c (frontend file created)
