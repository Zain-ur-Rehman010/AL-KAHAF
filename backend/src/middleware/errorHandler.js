module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${status}] ${message}`, err);

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
};
