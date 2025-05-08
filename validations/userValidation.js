const { body } = require("express-validator");
const { GENDER } = require("../utils/patientConstants");

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

    body("gender")
      .notEmpty()
      .withMessage("gender is required")
      .isIn(GENDER)
      .withMessage(`gender must be one of: ${GENDER.join(", ")}`),

    body("DateOfBirth")
      .notEmpty()
      .withMessage("DateOfBirth is required")
      .isISO8601()
      .withMessage("DateOfBirth must be a valid date in yyyy-mm-dd format"),
  ];
};

module.exports = userSchema;
