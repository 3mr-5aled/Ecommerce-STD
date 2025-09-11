/**
 * @fileoverview CSRF Routes
 *
 * This module defines routes for CSRF token management.
 * These routes handle token generation and validation for CSRF protection.
 *
 * Routes:
 * - GET /csrf-token - Generate and return a new CSRF token
 *
 * @module routes/csrf
 * @requires express
 * @requires ../middlewares/csrf.middleware
 *
 * @author E-commerce STD
 * @since 1.0.0
 */

const express = require("express");
const { generateCSRFToken } = require("../middlewares/csrf.middleware");

const router = express.Router();

/**
 * @route   GET /api/v1/csrf-token
 * @desc    Generate and return a new CSRF token
 * @access  Public (but should be called by same origin)
 * @returns {Object} JSON response with CSRF token
 *
 * @example
 * // Request
 * GET /api/v1/csrf-token
 *
 * // Response
 * {
 *   "status": "success",
 *   "data": {
 *     "csrfToken": "abc123...xyz"
 *   }
 * }
 */
router.get("/csrf-token", generateCSRFToken);

module.exports = router;
