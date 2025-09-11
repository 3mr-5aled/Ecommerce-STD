const categoryRoute = require("./category.route");
const subCategoryRoute = require("./subCategory.route");
const brandRoute = require("./brand.route");
const productRoute = require("./product.route");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const reviewRoute = require("./review.route");
const wishlistRoute = require("./wishlist.route");
const addressRoute = require("./address.route");
const couponRoute = require("./coupon.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const csrfRoute = require("./csrf.route");

const mountRoutes = (app) => {
  // Security route (should be mounted first)
  app.use("/api/v1", csrfRoute);

  // Business logic routes
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoutes;
