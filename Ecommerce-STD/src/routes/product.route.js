const express = require("express");
const csrfMiddleware = require("../middlewares/csrf.middleware");
const productService = require("../services/product.service"); // Assuming product.service.js exists for product-related logic
const router = express.Router();

// Apply CSRF protection middleware to all product routes
router.use(csrfMiddleware);

// Route to create a new product
router.post("/", async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Route to update an existing product
router.patch("/:id", async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Route to delete a product
router.delete("/:id", async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

// Route to get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Route to get a single product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;