# Product Requirements Document (PRD): ShipEase

## 1. Product Overview & Objective
**ShipEase** is a robust Transport Management System (TMS) designed to streamline logistics operations, bridge the gap between customers needing shipments, and drivers looking for deliveries. 

**Objective:**
To build a scalable and secure backend architecture that efficiently manages users, roles, and shipment lifecycles from creation to delivery. The system must guarantee data integrity, strict role-based access controls, and provide high reliability for logistics operations.

## 2. Target Audience & User Personas

| Persona | Description | Key Goals |
|---------|-------------|-----------|
| **Customer** | Individuals or businesses needing to transport goods. | - Easily create shipment requests.<br>- Track the status of their shipments.<br>- Secure login and data privacy. |
| **Manager** | Logistics coordinators/dispatchers who oversee operations. | - View all pending and active shipments.<br>- Assign available drivers to specific shipments.<br>- Monitor overall progress. |
| **Driver** | Fleet personnel responsible for executing the delivery. | - View assigned tasks.<br>- Accept assigned jobs.<br>- Update shipment statuses (e.g., in-transit, delivered). |

## 3. Core Features & Use Cases

### 3.1 Authentication & Authorization
- **Registration & Login:** Secure JWT-based authentication system.
- **Role-Based Access Control (RBAC):** Strict isolation of endpoints based on the authenticated user's role (`customer`, `manager`, `driver`).
- **Validation:** Strong input validation (using Zod) for email, minimum password lengths (6 chars), and mandatory fields.

### 3.2 Shipment Lifecycle Management
The shipment lifecycle follows a strict state machine: `pending` → `assigned` → `in-transit` → `delivered`.

- **Create Shipment:** Customers define `pickupLocation` and `deliveryLocation`. The system sets the status to `pending`.
- **View Shipments:** 
  - Managers can view a global list of all shipments.
  - Customers can view a filtered list of only their own shipments.
- **Assign Driver:** Managers transition a shipment from `pending` to `assigned` by linking a registered driver to the shipment.
- **Accept Assignment:** Drivers acknowledge an assignment, transitioning the status to `in-transit`. The system enforces that drivers can only accept shipments assigned specifically to them.
- **Update Status:** Drivers finalize the delivery, transitioning the status to `delivered`.

## 4. Technical Requirements

### 4.1 Stack & Architecture
- **Backend Framework:** Node.js with Express.js.
- **Database:** MongoDB (via Mongoose ORM).
- **Security:** Helmet, express-rate-limit (20 requests/15 mins on auth routes), bcryptjs (password hashing).
- **Architecture:** MVC (Models, Views/Routes, Controllers) with a centralized async error handler wrapper to catch and format API exceptions.

### 4.2 Data Models
**User Model:**
- `name`, `email` (unique), `password` (hashed).
- `role`: Enum [`customer`, `driver`, `manager`].

**Shipment Model:**
- `customer`: Reference to User.
- `assignedDriver`: Reference to User (nullable).
- `pickupLocation`, `deliveryLocation`.
- `status`: Enum [`pending`, `assigned`, `in-transit`, `delivered`].

### 4.3 API Responses
Standardized JSON responses for predictable client integration:
- **Success:** `{ "success": true, "data": { ... }, "message": "Success message" }`
- **Error:** `{ "success": false, "error": "Error description" }`

## 5. Testing & Quality Assurance
The application features a strict, automated end-to-end testing suite to prevent regressions.
- **Framework:** Jest & Supertest.
- **Database:** `mongodb-memory-server` for isolated, ephemeral test execution without polluting dev/prod data.
- **Coverage:** 100% endpoint coverage (24 automated test cases covering Auth flows, RBAC restrictions, and Shipment state transitions).

## 6. Success Metrics
1. **System Reliability:** 99.9% uptime for core API routes.
2. **Test Coverage:** Maintain zero failing tests and >90% coverage for new features.
3. **Response Time:** < 200ms average response time for standard CRUD operations.

## 7. Future Roadmap (v2.0)
- **Live Tracking:** Integration with Google Maps API for real-time geolocation of `in-transit` shipments.
- **Payment Gateway:** Stripe/Razorpay integration for customer billing.
- **Notifications:** Automated SMS/Email updates (via Twilio/Nodemailer) on status changes.
- **Admin Dashboard:** A comprehensive UI for managers to visualize analytics and fleet efficiency.
