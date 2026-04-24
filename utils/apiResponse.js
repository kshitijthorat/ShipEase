const ok = (res, data = null, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, data, message });

const fail = (res, status = 500, error = 'Internal Server Error') =>
  res.status(status).json({ success: false, error });

module.exports = { ok, fail };
