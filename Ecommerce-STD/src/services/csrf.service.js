const crypto = require("crypto");
const csrfConfig = require("../config/csrf.config");

// Function to generate a CSRF token
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Function to validate a CSRF token
const validateCsrfToken = (token, expectedToken) => {
  return token === expectedToken;
};

module.exports = {
  generateCsrfToken,
  validateCsrfToken,
};