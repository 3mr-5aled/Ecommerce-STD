/**
 * @fileoverview CSRF Protection Middleware
 *
 * This module provides CSRF (Cross-Site Request Forgery) protection for the e-commerce API.
 * It uses tokens to ensure that requests are coming from authorized sources and prevents
 * malicious websites from making requests on behalf of authenticated users.
 *
 * Features:
 * - Token generation and verification
 * - Cookie-based token storage
 * - Custom error handling for CSRF violations
 * - Configurable token expiration
 * - Support for both header and body token submission
 *
 * @module middlewares/csrf
 * @requires csrf
 * @requires express-async-handler
 * @requires ../utils/apiError.utils
 *
 * @author E-commerce STD
 * @since 1.0.0
 */

const Tokens = require("csrf");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError.utils");

// Initialize CSRF token generator
const tokens = new Tokens();

/**
 * CSRF Configuration
 */
const csrfConfig = {
  // Secret length for token generation (default: 18)
  secretLength: 18,
  // Salt length for token generation (default: 8)
  saltLength: 8,
  // Cookie options
  cookie: {
    name: "_csrf",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  // Header name to look for CSRF token
  headerName: "x-csrf-token",
  // Body field name to look for CSRF token
  bodyField: "_csrf",
};

/**
 * Determine if CSRF protection should be skipped for this request
 *
 * @param {Object} req - Express request object
 * @returns {boolean} True if CSRF should be skipped
 */
const shouldSkipCSRF = (req) => {
  // Skip for webhook endpoints
  if (req.path.includes("/webhook")) {
    return true;
  }

  // Skip for API key authentication (if implemented)
  if (req.headers["x-api-key"]) {
    return true;
  }

  // Skip for safe HTTP methods (GET, HEAD, OPTIONS)
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return true;
  }

  // Skip for development environment (optional - for testing)
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SKIP_CSRF === "true"
  ) {
    return true;
  }

  return false;
};

/**
 * Generate CSRF Secret
 * Creates a new secret for CSRF token generation
 *
 * @returns {string} Base64 encoded secret
 */
const generateSecret = () => tokens.secretSync();

/**
 * Generate CSRF Token
 * Creates a CSRF token using the provided secret
 *
 * @param {string} secret - The secret used to generate the token
 * @returns {string} CSRF token
 */
const generateToken = (secret) => tokens.create(secret);

/**
 * Verify CSRF Token
 * Verifies if the provided token is valid for the given secret
 *
 * @param {string} secret - The secret used to generate the token
 * @param {string} token - The token to verify
 * @returns {boolean} True if token is valid
 */
const verifyToken = (secret, token) => tokens.verify(secret, token);

/**
 * Middleware to generate and send CSRF token
 * This middleware should be used on routes that render forms or need CSRF tokens
 *
 * @route GET /api/v1/csrf-token
 * @access Public (but should be called by same origin)
 */
exports.generateCSRFToken = asyncHandler(async (req, res, next) => {
  // Generate secret and store in session/cookie
  const secret = generateSecret();
  const token = generateToken(secret);

  // Store secret in a secure cookie
  res.cookie("_csrf_secret", secret, {
    ...csrfConfig.cookie,
    name: "_csrf_secret",
  });

  // Send token to client
  res.status(200).json({
    status: "success",
    data: {
      csrfToken: token,
    },
  });
});

/**
 * Middleware to protect routes with CSRF validation
 * This middleware should be applied to all state-changing requests (POST, PUT, DELETE, PATCH)
 */
exports.csrfProtection = asyncHandler(async (req, res, next) => {
  // Skip CSRF protection for specific conditions
  if (shouldSkipCSRF(req)) {
    return next();
  }

  // Get secret from cookie
  const secret = req.cookies._csrf_secret;
  if (!secret) {
    return next(
      new ApiError("CSRF secret not found. Please refresh the page.", 403)
    );
  }

  // Get token from header or body
  let token = req.get(csrfConfig.headerName) || req.body[csrfConfig.bodyField];

  // For multipart forms, check if token is in query params as fallback
  if (!token && req.query._csrf) {
    token = req.query._csrf;
  }

  if (!token) {
    return next(
      new ApiError(
        "CSRF token missing. Please include CSRF token in your request.",
        403
      )
    );
  }

  // Verify token
  const isValid = verifyToken(secret, token);
  if (!isValid) {
    return next(
      new ApiError("Invalid CSRF token. Request rejected for security.", 403)
    );
  }

  next();
});

/**
 * Error handler specifically for CSRF-related errors
 * This middleware should be placed after CSRF protection middleware
 */
exports.csrfErrorHandler = (error, req, res, next) => {
  if (error.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      status: "fail",
      message: "Invalid CSRF token. Request rejected for security.",
      error: "CSRF_TOKEN_INVALID",
    });
  }

  next(error);
};

/**
 * Utility function to get CSRF token from request
 * Can be used in other parts of the application
 *
 * @param {Object} req - Express request object
 * @returns {string|null} CSRF token or null if not found
 */
exports.getCSRFToken = (req) =>
  req.get(csrfConfig.headerName) ||
  req.body[csrfConfig.bodyField] ||
  req.query._csrf ||
  null;

/**
 * Configuration object export for use in other modules
 */
exports.csrfConfig = csrfConfig;

/**
 * Utility functions export for testing and other modules
 */
exports.utils = {
  generateSecret,
  generateToken,
  verifyToken,
};
