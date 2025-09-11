const csrfService = require('../services/csrf.service');
const ApiError = require('../utils/apiError.utils');
const User = require('../models/user.model'); // Assuming you have a User model

// Function to register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Logic for user registration (e.g., hashing password, saving user to DB)
    const newUser = await User.create({ username, password });

    // Generate CSRF token for the new session
    const csrfToken = csrfService.generateToken();

    // Set CSRF token in cookie or session
    res.cookie('csrfToken', csrfToken, { httpOnly: true });

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
        csrfToken,
      },
    });
  } catch (error) {
    return next(new ApiError('Error registering user', 400));
  }
};

// Function to log in a user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Logic for user authentication (e.g., checking password)
    const user = await User.findOne({ username });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new ApiError('Incorrect username or password', 401));
    }

    // Generate CSRF token for the session
    const csrfToken = csrfService.generateToken();

    // Set CSRF token in cookie or session
    res.cookie('csrfToken', csrfToken, { httpOnly: true });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        csrfToken,
      },
    });
  } catch (error) {
    return next(new ApiError('Error logging in user', 400));
  }
};

// Function to log out a user
exports.logout = (req, res) => {
  // Clear the CSRF token cookie
  res.clearCookie('csrfToken');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};