const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");

var bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const { isStrongPassword } = require("validator");

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = appError.createError("User Already Exist", 400, ERROR);
    return next(error);
  }
  if (!isStrongPassword(password)) {
    const error = appError.createError(
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      400,
      ERROR
    );
    return next(error);
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashPassword });
    const token = createToken(newUser);
    newUser.token = token;
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
};
