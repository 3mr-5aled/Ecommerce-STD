const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict",
    maxAge: 3600, // 1 hour
  },
});

module.exports = csrfProtection;