const crypto = require("crypto");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);

// Function to generate a secure CSRF token
const generateCsrfToken = async () => {
  const buffer = await randomBytes(32);
  return buffer.toString("hex");
};

// Function to set CSRF token in a cookie
const setCsrfCookie = (res, token) => {
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false, // Allow access to the cookie from JavaScript
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// Function to validate the CSRF token
const validateCsrfToken = (token, expectedToken) => {
  return token === expectedToken;
};

module.exports = {
  generateCsrfToken,
  setCsrfCookie,
  validateCsrfToken,
};