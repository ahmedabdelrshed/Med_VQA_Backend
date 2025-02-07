const { body } = require("express-validator");

const userSchema = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("firstName is required")
      .isLength({ min: 3, max: 12 })
      .withMessage("min length is required 5"),

    body("lastName")
      .notEmpty()
      .withMessage("lastName is required")
      .isLength({ min: 3, max: 12 })
      .withMessage("min length is required 5"),

    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("please enter a valid email address"),

    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 }),
  ];
};

module.exports = userSchema;
