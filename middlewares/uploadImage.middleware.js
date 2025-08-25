const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError.utils");

/**
 * Creates and configures multer upload middleware with memory storage and image filtering.
 *
 * @function multerOptions
 * @returns {multer.Multer} Configured multer instance with memory storage and image-only file filter
 * @description This function sets up multer with:
 * - Memory storage to store files in memory as Buffer objects
 * - File filter that only accepts files with image MIME types
 * - Throws ApiError with 400 status code for non-image files
 */
const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

exports.resizeSingleImage = (
  uploadPath,
  mimetype,
  quality,
  imageLength,
  imageWidth,
  fieldName = "image"
) =>
  asyncHandler(async (req, res, next) => {
    /**
     * Generates a unique filename for a product image using UUID and timestamp.
     * The filename follows the pattern: product-{uuid}-{timestamp}.jpeg
     * @type {string} A unique filename string for product image storage
     */
    const filename = `${uploadPath}-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(imageLength, imageWidth)
        .toFormat(mimetype)
        .jpeg({ quality: quality })
        .toFile(`uploads/${uploadPath}s/${filename}`);

      // Save image into our db
      req.body[fieldName] = filename;
    }

    next();
  });

exports.resizeMixOfImages = (configs) =>
  asyncHandler(async (req, res, next) => {
    if (!req.files) {
      return next();
    }

    // Process each field configuration
    await Promise.all(
      configs.map(async (config) => {
        /**
         * Configuration object for image upload middleware
         * @typedef {Object} UploadImageConfig
         * @property {string} fieldName - The name of the form field containing the image
         * @property {string} mimetype - The expected MIME type of the uploaded image
         * @property {number} quality - The compression quality for the processed image (0-100)
         * @property {number} imageLength - The target length/height for image resizing
         * @property {number} imageWidth - The target width for image resizing
         * @property {boolean} isArray - Whether the field accepts multiple images as an array
         * @property {string} uploadPath - The file system path where processed images will be stored
         */
        const {
          fieldName,
          mimetype,
          quality,
          imageLength,
          imageWidth,
          isArray,
          uploadPath,
        } = config;
        const folderPath = uploadPath || `${fieldName}s`;

        if (req.files[fieldName]) {
          if (isArray) {
            // Handle multiple images (array field)
            req.body[fieldName] = [];
            await Promise.all(
              req.files[fieldName].map(async (file, index) => {
                const filename = `${fieldName}-${uuidv4()}-${Date.now()}-${
                  index + 1
                }.jpeg`;

                await sharp(file.buffer)
                  .resize(imageLength, imageWidth)
                  .toFormat(mimetype)
                  .jpeg({ quality: quality })
                  .toFile(`uploads/${folderPath}s/${filename}`);

                req.body[fieldName].push(filename);
              })
            );
          } else {
            // Handle single image
            const filename = `${fieldName}-${uuidv4()}-${Date.now()}.jpeg`;

            await sharp(req.files[fieldName][0].buffer)
              .resize(imageLength, imageWidth)
              .toFormat(mimetype)
              .jpeg({ quality: quality })
              .toFile(`uploads/${folderPath}s/${filename}`);

            req.body[fieldName] = filename;
          }
        }
      })
    );

    next();
  });
