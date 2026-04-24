// 404 handler
const notFound = (req, res, next) => {
  res.status(404).json({ success: false, error: `Not Found - ${req.originalUrl}` });
};

// Central error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status =
    err.status ||
    err.statusCode ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(status).json({ success: false, error: message });
};

module.exports = { notFound, errorHandler };
