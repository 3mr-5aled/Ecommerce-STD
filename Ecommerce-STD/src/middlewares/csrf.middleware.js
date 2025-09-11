const csrf = require("csurf");
const ApiError = require("../utils/apiError.utils");

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: true, // Use cookies to store the CSRF token
});

// Middleware to check for CSRF token
const csrfMiddleware = (req, res, next) => {
  csrfProtection(req, res, (err) => {
    if (err) {
      return next(new ApiError("Invalid CSRF token", 403));
    }
    next();
  });
};

module.exports = csrfMiddleware;