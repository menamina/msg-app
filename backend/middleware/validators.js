import { body, validationResult } from "express-validator";

const validator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail.withMessage("Email must be valid"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Email must be at least 8 characters"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    } else {
      return true;
    }
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = validator;
