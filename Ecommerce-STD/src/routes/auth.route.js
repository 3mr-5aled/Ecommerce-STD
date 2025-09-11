const express = require("express");
const { login, register } = require("../services/auth.service");
const { csrfProtection } = require("../middlewares/csrf.middleware");

const router = express.Router();

// Registration route
router.post("/register", csrfProtection, async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login route
router.post("/login", csrfProtection, async (req, res, next) => {
  try {
    const token = await login(req.body);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Export the router
module.exports = router;