const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const {
  createShipmentSchema,
  assignDriverSchema,
  shipmentIdParamSchema,
  updateStatusSchema,
} = require('../validators/shipmentValidators');
const {
  createShipment,
  getAllShipments,
  getMyShipments,
  assignDriver,
  acceptShipment,
  updateStatus,
} = require('../controllers/shipmentController');

const router = express.Router();

// Customer
router.post(
  '/',
  protect,
  authorizeRoles('customer'),
  validate(createShipmentSchema),
  createShipment
);
router.get('/my', protect, authorizeRoles('customer'), getMyShipments);

// Manager
router.get('/', protect, authorizeRoles('manager'), getAllShipments);
router.put(
  '/:id/assign',
  protect,
  authorizeRoles('manager'),
  validate(assignDriverSchema),
  assignDriver
);

// Driver
router.put(
  '/:id/accept',
  protect,
  authorizeRoles('driver'),
  validate(shipmentIdParamSchema),
  acceptShipment
);
router.put(
  '/:id/status',
  protect,
  authorizeRoles('driver'),
  validate(updateStatusSchema),
  updateStatus
);

module.exports = router;
