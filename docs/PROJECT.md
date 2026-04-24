# ShipEase Backend Specification

## 1. Project Purpose & Scope

ShipEase is a Transport Management System designed to manage shipments, drivers, and logistics operations. It allows customers to create shipment requests, managers to assign drivers, and drivers to execute deliveries.

### Main User Journeys

* Customer: Register → Login → Create Shipment → Track Status
* Manager: Login → View Shipments → Assign Driver → Monitor Progress
* Driver: Login → Accept Assignment → Update Delivery Status

---

## 2. Roles & Permissions

### Roles

* customer
* driver
* manager

### Permissions

| Role     | Permissions                                         |
| -------- | --------------------------------------------------- |
| Customer | Create shipment, view own shipments                 |
| Driver   | View assigned shipments, accept jobs, update status |
| Manager  | View all shipments, assign drivers                  |

---

## 3. Entities / Data Models

### User

* _id
* name
* email
* password
* role (customer | driver | manager)
* createdAt

### Shipment

* _id
* customer (User reference)
* pickupLocation
* deliveryLocation
* status (pending, assigned, in-transit, delivered)
* assignedDriver (User reference)
* createdAt

### (Future)

Vehicle

* driver
* vehicleNumber
* type

Address (optional normalization)

* street, city, state, pincode

Payment (future scope)

* shipment
* amount
* status

---

## 4. API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Shipment

* POST /api/shipments (customer)
* GET /api/shipments (manager)
* GET /api/shipments/my (customer)
* PUT /api/shipments/:id/assign (manager)
* PUT /api/shipments/:id/accept (driver)
* PUT /api/shipments/:id/status (driver)

### Example Request (Register)

{
"name": "Test",
"email": "[test@gmail.com](mailto:test@gmail.com)",
"password": "123456",
"role": "customer"
}

### Example Response

{
"success": true,
"data": { ... },
"message": "User registered successfully"
}

---

## 5. Auth Rules

* JWT-based authentication
* Token expiry: 7 days
* No refresh token (initial version)
* Password hashing using bcrypt
* Roles stored in token payload

---

## 6. External Integrations (Future)

* Maps API (Google Maps) for tracking
* Payment Gateway (Razorpay/Stripe)
* Email/SMS notifications (Nodemailer/Twilio)

---

## 7. Environment / Config

.env variables:

* PORT
* MONGO_URI
* JWT_SECRET
* CLIENT_URL (for CORS)

---

## 8. Non-Functional Requirements

### Validation

* Use Joi or Zod

### Error Handling

* Standard format:
  {
  "success": false,
  "error": "Error message"
  }

### Logging

* Morgan for request logs

### Security

* Helmet
* Rate limiting on auth routes
* CORS restricted to CLIENT_URL

---

## 9. Improvements / Best Practices

### Security

* Rotate secrets regularly
* Store .env in .gitignore
* Provide .env.example

### Code Structure

* MVC architecture
* Central error handler
* Async handler wrapper
* Consistent response format

### Developer Experience

* README.md
* Postman collection
* Node version via .nvmrc

---

## 10. Future Enhancements

* Real-time tracking
* Admin dashboard
* Analytics & reporting
* Multi-tenant support
