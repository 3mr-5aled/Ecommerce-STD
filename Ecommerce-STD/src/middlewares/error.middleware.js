const ApiError = require("../utils/apiError.utils");

const globalError = (err, req, res, next) => {
  // Set default status code and message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong!";

  // Handle specific error types
  if (err.name === "CastError") {
    err.message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    err.message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
    err.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors)
      .map((el) => el.message)
      .join(". ");
    err.statusCode = 400;
  }

  // Send error response
  res.status(err.statusCode).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
};

module.exports = globalError;