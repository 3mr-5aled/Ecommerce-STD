const {
  uploadMixOfImages,
  resizeMixOfImages,
} = require("../middlewares/uploadImage.middleware");
const factory = require("./handlers.factory");
const Product = require("../models/product.model");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = resizeMixOfImages([
  {
    fieldName: "imageCover",
    mimetype: "jpeg",
    quality: 95,
    imageLength: 2000,
    imageWidth: 1333,
    isArray: false,
    uploadPath: "product",
  },
  {
    fieldName: "images",
    mimetype: "jpeg",
    quality: 95,
    imageLength: 2000,
    imageWidth: 1333,
    isArray: true,
    uploadPath: "product",
  },
]);

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);
