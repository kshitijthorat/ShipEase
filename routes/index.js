const express = require('express');
const authRoutes = require('./authRoutes');
const protectedRoutes = require('./protectedRoutes');
const BookingRoutes = require('./BookingRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/booking', require('./BookingRoutes'));
router.use('/test', protectedRoutes);
// dev debug routes
if (process.env.NODE_ENV !== 'production') {
	// require here so we don't load in production
	const debugRoutes = require('./debugRoutes');
	router.use('/debug', debugRoutes);
}

module.exports = router;
