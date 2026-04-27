const express = require('express');
const authRoutes = require('./authRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const protectedRoutes = require('./protectedRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/test', protectedRoutes);

module.exports = router;
