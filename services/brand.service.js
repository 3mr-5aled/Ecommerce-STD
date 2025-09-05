const factory = require("./handlers.factory");
const {
  uploadSingleImage,
  resizeImages,
} = require("../middlewares/uploadImage.middleware");
const Brand = require("../models/brand.model");

// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = resizeImages({
  fieldName: "image",
  uploadPath: "brand",
  mimetype: "jpeg",
  quality: 95,
  imageLength: 600,
  imageWidth: 600,
  isArray: false,
});

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
