const express = require('express');
const authRoutes = require('./authRoutes');
const shipmentRoutes = require('./shipmentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);

module.exports = router;
