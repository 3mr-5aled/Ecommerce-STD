/**
 * @fileoverview CSRF Utility Functions
 *
 * This module provides utility functions for CSRF token management
 * that can be used throughout the application. These utilities help
 * with token validation, extraction, and integration with other middleware.
 *
 * @module utils/csrf
 * @requires ../middlewares/csrf.middleware
 *
 * @author E-commerce STD
 * @since 1.0.0
 */

const { getCSRFToken, csrfConfig } = require("../middlewares/csrf.middleware");

/**
 * Extract CSRF token from various sources in request
 *
 * @param {Object} req - Express request object
 * @returns {string|null} CSRF token or null if not found
 *
 * @example
 * const token = extractCSRFToken(req);
 * if (token) {
 *   // Token found, proceed with validation
 * }
 */
const extractCSRFToken = (req) => getCSRFToken(req);

/**
 * Check if request should be exempt from CSRF protection
 * This is useful for custom middleware or conditional protection
 *
 * @param {Object} req - Express request object
 * @returns {boolean} True if request should be exempt
 *
 * @example
 * if (isCSRFExempt(req)) {
 *   // Skip CSRF validation
 *   return next();
 * }
 */
const isCSRFExempt = (req) => {
  // Safe HTTP methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return true;
  }

  // Webhook endpoints
  if (req.path.includes("/webhook")) {
    return true;
  }

  // API key authentication
  if (req.headers["x-api-key"]) {
    return true;
  }

  // Development override
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SKIP_CSRF === "true"
  ) {
    return true;
  }

  return false;
};

/**
 * Middleware to conditionally apply CSRF protection
 * Use this when you need more granular control over CSRF protection
 *
 * @param {Function} condition - Function that returns boolean for whether to apply CSRF
 * @returns {Function} Express middleware function
 *
 * @example
 * // Apply CSRF only to admin routes
 * app.use('/api/v1/admin', conditionalCSRF((req) => req.user?.role === 'admin'));
 */
const conditionalCSRF = (condition) => {
  const { csrfProtection } = require("../middlewares/csrf.middleware");

  return (req, res, next) => {
    if (condition(req)) {
      return csrfProtection(req, res, next);
    }
    next();
  };
};

/**
 * Get CSRF configuration for client-side usage
 *
 * @returns {Object} Client-safe CSRF configuration
 *
 * @example
 * const config = getCSRFConfig();
 * console.log(config.headerName); // 'x-csrf-token'
 */
const getCSRFConfig = () => ({
  headerName: csrfConfig.headerName,
  bodyField: csrfConfig.bodyField,
  cookieName: csrfConfig.cookie.name,
});

/**
 * Validate CSRF token format (basic client-side validation)
 * Note: This is NOT a security validation, just format checking
 *
 * @param {string} token - Token to validate format
 * @returns {boolean} True if token has valid format
 *
 * @example
 * if (!isValidTokenFormat(token)) {
 *   alert('Invalid token format');
 *   return;
 * }
 */
const isValidTokenFormat = (token) => {
  if (!token || typeof token !== "string") {
    return false;
  }

  // Basic format checks
  return token.length > 10 && token.length < 500;
};

/**
 * Generate error response for CSRF violations
 * Standardizes CSRF error responses across the application
 *
 * @param {string} message - Error message
 * @param {string} errorCode - Error code for client handling
 * @returns {Object} Standardized error response
 *
 * @example
 * const error = generateCSRFError('Token missing', 'CSRF_TOKEN_MISSING');
 * return res.status(403).json(error);
 */
const generateCSRFError = (
  message = "CSRF token validation failed",
  errorCode = "CSRF_ERROR"
) => ({
  status: "fail",
  message,
  error: errorCode,
  timestamp: new Date().toISOString(),
  docs: "/docs/csrf-protection",
});

/**
 * Log CSRF-related events for monitoring
 *
 * @param {string} event - Event type (success, failure, bypass, etc.)
 * @param {Object} req - Express request object
 * @param {Object} details - Additional details to log
 *
 * @example
 * logCSRFEvent('token_missing', req, { userAgent: req.get('User-Agent') });
 */
const logCSRFEvent = (event, req, details = {}) => {
  const logger = require("./logger.utils");

  logger.info("CSRF Event", {
    event,
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get("User-Agent"),
    referer: req.get("Referer"),
    timestamp: new Date().toISOString(),
    ...details,
  });
};

/**
 * Middleware to add CSRF token to response for SPA applications
 * This automatically includes CSRF token in API responses when needed
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 *
 * @example
 * // Use in routes that need to provide tokens to frontend
 * app.use('/api/v1/user', addCSRFToResponse);
 */
const addCSRFToResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Only add CSRF token for successful responses that need it
    if (res.statusCode >= 200 && res.statusCode < 300 && req.method === "GET") {
      const token = extractCSRFToken(req);
      if (token) {
        data = {
          ...data,
          _csrf: token,
        };
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Check if request has valid CSRF setup (secret and token)
 * Useful for debugging and health checks
 *
 * @param {Object} req - Express request object
 * @returns {Object} Validation status
 *
 * @example
 * const status = checkCSRFSetup(req);
 * if (!status.valid) {
 *   console.log('CSRF Issue:', status.issues);
 * }
 */
const checkCSRFSetup = (req) => {
  const issues = [];
  const secret = req.cookies._csrf_secret;
  const token = extractCSRFToken(req);

  if (!secret) {
    issues.push("Missing CSRF secret cookie");
  }

  if (!token && ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    issues.push("Missing CSRF token for state-changing request");
  }

  if (token && !isValidTokenFormat(token)) {
    issues.push("Invalid CSRF token format");
  }

  return {
    valid: issues.length === 0,
    issues,
    hasSecret: !!secret,
    hasToken: !!token,
    method: req.method,
    exempt: isCSRFExempt(req),
  };
};

module.exports = {
  extractCSRFToken,
  isCSRFExempt,
  conditionalCSRF,
  getCSRFConfig,
  isValidTokenFormat,
  generateCSRFError,
  logCSRFEvent,
  addCSRFToResponse,
  checkCSRFSetup,
};
