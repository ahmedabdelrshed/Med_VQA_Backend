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

const handlePasswordUpdate = async (updateData, user) => {
  if (updateData.password && updateData.oldPassword) {
    const matchedPassword = await bcrypt.compare(
      updateData.oldPassword,
      user.password
    );
    if (!matchedPassword) {
      throw appError.createError("Incorrect old password", 400, "ERROR");
    }
    if (!isStrongPassword(updateData.password)) {
      throw appError.createError(
        "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        400,
        "ERROR"
      );
    }
    const hashedPassword =await createHashPassword(updateData.password);
    updateData.password = hashedPassword;

    delete updateData.oldPassword;
  } 
};

const validateNameLength = (updateData) => {
  const { firstName, lastName } = updateData;

  checkName(firstName,"First name");

  checkName(lastName,"Last name");
};

const checkName = (name,message) => {
  if (name) {
    if (name.length < 3 || name.length > 12) {
      throw appError.createError(
        `${message} must be between 3 and 12 characters`,
        400,
        "ERROR"
      );
    }
  }
};



module.exports = { checkUserExist, createHashPassword, checkStrongPassword, handlePasswordUpdate, validateNameLength, };
