const { isStrongPassword } = require("validator");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");
const bcrypt = require("bcryptjs");

const checkUserExist = async (email, next) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = appError.createError("User Already Exist", 400, ERROR);
    return next(error);
  }
};

const checkStrongPassword = (password, next) => {
  if (!isStrongPassword(password)) {
    const error = appError.createError(
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      400,
      ERROR
    );
    return next(error);
  }
};

const createHashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = { checkUserExist, createHashPassword, checkStrongPassword };
