const { body, validationResult, param } = require("express-validator");

exports.registerValidation = [
  body("nom").notEmpty().withMessage("Nom is required"),
  body("prenom").notEmpty().withMessage("Prenom is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })  // Changed from 8 to 6 to match the frontend validation
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Role must be either admin or user"),
];
exports.loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];
exports.placeValidation = [
  body("nom_place")
    .notEmpty()
    .withMessage("Place name is required")
    .isLength({ max: 255 })
    .withMessage("Name too long"),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description too long"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("url_img").optional().isURL().withMessage("Invalid image URL"),
  body("url_web").optional().isURL().withMessage("Invalid website URL"),
];

exports.idValidation = [param("id").isInt().withMessage("Invalid ID format")];
