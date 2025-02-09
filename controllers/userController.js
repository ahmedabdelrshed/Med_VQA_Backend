const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");

var bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const { isStrongPassword } = require("validator");
const jwt = require("jsonwebtoken");

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

const login =async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try{
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = await User.findOne({ email}).select("+password");

  if (!user) {
    const error = appError.createError("User not found", 404, ERROR);
    return next(error);
  }

  const matchedPassword=await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    const error = appError.createError("Incorrect Password", 401, ERROR);
    return next(error);
  }
  const token = createToken(user);
  user.token = token;
  res.json({
    message: "Login successful",
    token: token,
  })}
  catch (error) {
    next(error);
  };

};
const updateUser = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return next(appError.createError("Unauthorized access", 401, ERROR));
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      const user = await User.findById(userId).select("+password");
      if (!user) {
        return next(appError.createError("User not found", 404, ERROR));
      }
  
      if (req.body.email) {
        return next(appError.createError("Email cannot be updated", 400, ERROR));
      }
  
      await handlePasswordUpdate(req.body, user);
  
      validateNameLength(req.body);
  
      if (req.file) {
        req.body.avatar = `uploads/${req.file.filename}`;
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedUser) {
        return next(appError.createError("User update failed", 500, ERROR));
      }
  
      res.json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
      next(error);
    }
  };
  
const handlePasswordUpdate = async (updateData, user) => {
    if (updateData.password && updateData.oldPassword) {
      const matchedPassword = await bcrypt.compare(updateData.oldPassword, user.password);
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
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
  
      delete updateData.oldPassword;
    } else if (updateData.password && !updateData.oldPassword) {
      throw appError.createError("Old password is required", 400, "ERROR");
    }
  };
  const validateNameLength = (updateData) => {
    const { firstName, lastName } = updateData;
  
    if (firstName && (firstName.length < 3 || firstName.length > 12)) {
      throw appError.createError("First name must be between 3 and 12 characters", 400, "ERROR");
    }
  
    if (lastName && (lastName.length < 3 || lastName.length > 12)) {
      throw appError.createError("Last name must be between 3 and 12 characters", 400, "ERROR");
    }
  };
    

module.exports = {
  register,
  login,
  updateUser,
};
