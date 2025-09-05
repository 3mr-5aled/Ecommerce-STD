/**
 * @fileoverview User Validation Middleware
 *
 * This module provides comprehensive validation middleware for user-related operations
 * in the e-commerce application. It uses express-validator to validate and sanitize
 * user input for creating, updating, retrieving, and deleting users.
 *
 * Key Features:
 * - User creation validation with password confirmation
 * - Email uniqueness validation
 * - Phone number validation for Egyptian and Saudi Arabian numbers
 * - Password change validation with current password verification
 * - MongoDB ObjectId validation for user IDs
 * - Automatic slug generation for user names
 *
 * @module validators/user
 * @requires slugify
 * @requires bcryptjs
 * @requires express-validator
 * @requires ../../middlewares/validator.middleware
 * @requires ../../models/user.model
 *
 * @author E-commerce STD
 * @since 1.0.0
 */

const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const User = require("../../models/user.model");

/**
 * Validation middleware for creating a new user
 *
 * Validates the following fields:
 * - name: Required, minimum 3 characters, auto-generates slug
 * - email: Required, valid email format, must be unique
 * - password: Required, minimum 6 characters, must match confirmation
 * - passwordConfirm: Required, must match password
 * - phone: Optional, must be valid Egyptian or Saudi Arabian phone number
 * - profileImg: Optional image field
 * - role: Optional role assignment
 *
 * @type {Array<ValidationChain>} Array of express-validator validation chains
 */
exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      // Auto-generate URL-friendly slug from the user's name
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      // Check if email already exists in database
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      // Ensure password matches confirmation
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),

  validatorMiddleware,
];

/**
 * Validation middleware for retrieving a specific user
 *
 * Validates:
 * - id: Must be a valid MongoDB ObjectId
 *
 * @type {Array<ValidationChain>} Array of express-validator validation chains
 */
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

/**
 * Validation middleware for updating user information
 *
 * Validates:
 * - id: Must be a valid MongoDB ObjectId
 * - name: Optional, auto-generates slug if provided
 * - email: Required, valid email format, must be unique
 * - phone: Optional, must be valid Egyptian or Saudi Arabian phone number
 * - profileImg: Optional image field
 * - role: Optional role assignment
 *
 * @type {Array<ValidationChain>} Array of express-validator validation chains
 */
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      // Auto-generate URL-friendly slug from the user's name
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      // Check if email already exists in database
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"]) // validate egyptian and saudi arabian phone numbers
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

/**
 * Validation middleware for changing user password
 *
 * This validator performs comprehensive password change validation:
 * 1. Validates the user ID format
 * 2. Verifies the current password against the stored hash
 * 3. Ensures new password matches confirmation
 * 4. Enforces password strength requirements
 *
 * Validates:
 * - id: Must be a valid MongoDB ObjectId
 * - currentPassword: Required, must match the user's current password
 * - password: Required, new password
 * - passwordConfirm: Required, must match the new password
 *
 * @type {Array<ValidationChain>} Array of express-validator validation chains
 */
exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      /**
       * Compares the provided current password with the user's stored hashed password
       * @type {boolean} Returns true if the password matches the hash, false otherwise
       */
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirmation matches new password
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

/**
 * Validation middleware for deleting a user
 *
 * Validates:
 * - id: Must be a valid MongoDB ObjectId
 *
 * @type {Array<ValidationChain>} Array of express-validator validation chains
 */
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

/**
 * Validation middleware for updating logged-in user's own profile
 *
 * This validator is used when a user updates their own profile information.
 * It's similar to updateUserValidator but may have different permissions/restrictions.
 *
 * Validates:
 * - name: Optional, auto-generates slug if provided
 * - email: Required, valid email format, must be unique
 * - phone: Optional, must be valid Egyptian or Saudi Arabian phone number
 *
 * @type {Array<ValidationChain>} Array of express-validator validation chains
 */
exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      // Auto-generate URL-friendly slug from the user's name
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      // Check if email already exists in database
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];
