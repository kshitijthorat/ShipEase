const Shipment = require('../models/Shipment');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

// POST /api/shipments  (customer)
const createShipment = asyncHandler(async (req, res) => {
  const { pickupLocation, deliveryLocation } = req.body;
  const shipment = await Shipment.create({
    customer: req.user._id,
    pickupLocation,
    deliveryLocation,
  });
  return ok(res, shipment, 'Shipment created', 201);
});

// GET /api/shipments  (manager)
const getAllShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find()
    .populate('customer', 'name email role')
    .populate('assignedDriver', 'name email role')
    .sort({ createdAt: -1 });
  return ok(res, shipments, 'All shipments');
});

// GET /api/shipments/my  (customer)
const getMyShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({ customer: req.user._id })
    .populate('assignedDriver', 'name email role')
    .sort({ createdAt: -1 });
  return ok(res, shipments, 'My shipments');
});

// PUT /api/shipments/:id/assign  (manager)
const assignDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { driverId } = req.body;

  const driver = await User.findById(driverId);
  if (!driver || driver.role !== 'driver') {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid driver' });
  }

  const shipment = await Shipment.findById(id);
  if (!shipment) {
    return res
      .status(404)
      .json({ success: false, error: 'Shipment not found' });
  }

  shipment.assignedDriver = driver._id;
  shipment.status = 'assigned';
  await shipment.save();

  return ok(res, shipment, 'Driver assigned');
});

// PUT /api/shipments/:id/accept  (driver)
const acceptShipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    return res
      .status(404)
      .json({ success: false, error: 'Shipment not found' });
  }
  if (
    !shipment.assignedDriver ||
    shipment.assignedDriver.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ success: false, error: 'Not assigned to this shipment' });
  }
  if (shipment.status !== 'assigned') {
    return res.status(400).json({
      success: false,
      error: `Cannot accept shipment in status '${shipment.status}'`,
    });
  }
  shipment.status = 'in-transit';
  await shipment.save();
  return ok(res, shipment, 'Shipment accepted');
});

// PUT /api/shipments/:id/status  (driver)
const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const shipment = await Shipment.findById(id);
  if (!shipment) {
    return res
      .status(404)
      .json({ success: false, error: 'Shipment not found' });
  }
  if (
    !shipment.assignedDriver ||
    shipment.assignedDriver.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ success: false, error: 'Not assigned to this shipment' });
  }

  // Allowed transitions:
  // assigned -> in-transit
  // in-transit -> delivered
  const current = shipment.status;
  const allowed =
    (current === 'assigned' && status === 'in-transit') ||
    (current === 'in-transit' && status === 'delivered');
  if (!allowed) {
    return res.status(400).json({
      success: false,
      error: `Invalid status transition from '${current}' to '${status}'`,
    });
  }

  shipment.status = status;
  await shipment.save();
  return ok(res, shipment, 'Status updated');
});

module.exports = {
  createShipment,
  getAllShipments,
  getMyShipments,
  assignDriver,
  acceptShipment,
  updateStatus,
};
