/**
 * 404 Not Found Middleware
 * Intercepts any incoming HTTP request that does not match any registered route
 * and returns a standard JSON error response instead of default HTML.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

module.exports = notFound;
