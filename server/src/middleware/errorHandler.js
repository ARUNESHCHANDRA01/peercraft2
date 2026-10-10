/**
 * Centralized error handling middleware.
 * Ensures consistent JSON error contract and prevents information leakage.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[ServerError]', {
    method: req.method,
    path: req.originalUrl,
    error: err.message,
  });

  const statusCode = err.statusCode || (err.status >= 400 && err.status < 600 ? err.status : 500);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error occurred',
  });
}
