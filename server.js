const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError.utils");
const globalError = require("./middlewares/error.middleware");
const {
  csrfProtection,
  csrfErrorHandler,
} = require("./middlewares/csrf.middleware");
const dbConnection = require("./config/database");
// Routes
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/order.service");

// Connect with db only if not in test environment
if (process.env.NODE_ENV !== "test") {
  dbConnection();
}

// express app
const app = express();

// Trust proxy
app.set("trust proxy", 1);

// Security HTTP headers
app.use(helmet());

// var corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// compress all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middlewares
// Cookie parser middleware (required for CSRF)
app.use(cookieParser());

// Body parser, reading data from body into req.body - limit to 20kb
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after a while",
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message:
    "Too many accounts created from this IP, please try again after a while",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);
app.use("/api/v1/auth", authLimiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// Apply CSRF protection to state-changing routes
app.use("/api/v1", (req, res, next) => {
  // Apply CSRF protection to all routes except GET requests and specific endpoints
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// CSRF error handling middleware (before global error handler)
app.use(csrfErrorHandler);

// Global error handling middleware for express
app.use(globalError);

// Export app for testing
module.exports = app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8000;
  const server = app.listen(PORT, () => {
    console.log(`App running running on port ${PORT}`);
  });

  // Handle port already in use error
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.log(
        `💡 Try running: taskkill /PID $(netstat -ano | findstr :${PORT} | head -1 | awk '{print $5}') /F`
      );
      console.log(`💡 Or change the PORT in your config.env file`);
      process.exit(1);
    } else {
      console.error(`Server error: ${err.message}`);
      process.exit(1);
    }
  });

  // Handle rejection outside express
  process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });
}
