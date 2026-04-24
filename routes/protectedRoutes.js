// routes/protectedRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Test 1: Any logged in user can access this
// protect runs first — checks token is valid
router.get("/user-only", protect, (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}! You are logged in.`,
    role: req.user.role,
  });
});

// Test 2: Only managers can access this
// protect runs first → then authorizeRoles checks the role
router.get("/manager-only", protect, authorizeRoles("manager"), (req, res) => {
  res.json({
    message: `Welcome Manager ${req.user.name}! You have full access.`,
  });
});

// Test 3: Both drivers and managers can access this
router.get("/driver-manager", protect, authorizeRoles("driver", "manager"), (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}! Role: ${req.user.role}`,
  });
});

module.exports = router;