const express = require("express");
const authRoutes = require("./auth.route");
const productRoutes = require("./product.route");
const csrfMiddleware = require("../middlewares/csrf.middleware");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", csrfMiddleware, authRoutes);
  app.use("/api/v1/products", csrfMiddleware, productRoutes);
};

module.exports = mountRoutes;