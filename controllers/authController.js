const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const HealthRecord = require("../models/healthModel");

const {
  checkUserExist,
  createHashPassword,
  checkStrongPassword,
} = require("../services/userService");
const { sendVerificationEmail } = require("../utils/SendVerificationEmail");

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  checkUserExist(email, next);
  checkStrongPassword(password, next);

  try {
    const hashPassword = await createHashPassword(password);

    const newUser = new User({
      ...req.body,
      password: hashPassword,
    });

    await newUser.save();

    const token = createToken(newUser, "15m");

    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({
      message: "Verification email sent successfully. Please check your email.",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = appError.createError(
        "Email or Password are not correct",
        404,
        "ERROR"
      );
      return next(error);
    }

    if (!user.isVerified) {
      const error = appError.createError(
        "Email is not verified. Please check your email to verify your account.",
        403,
        "ERROR"
      );
      return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      const error = appError.createError("Incorrect Password", 401, "ERROR");
      return next(error);
    }

    const expireDate = rememberMe ? "7d" : "1d";
    const token = createToken(user, expireDate);
    let isHasHealthRecord = false;
    const healthRecord = await HealthRecord.findOne({ userId: user._id });
    if (healthRecord) {
      isHasHealthRecord = true;
    }
    res.json({
      token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isHasHealthRecord
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const email = req.currentUser.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isVerified) {
      const error = appError.createError(
        "User is already verified",
        400,
        "ERROR"
      );
      return next(error);
    }
    user.isVerified = true;
    await user.save();
    res.json({
      message: "User verified successfully you can login successfully",
    });
  } catch (err) {
    const error = appError.createError(
      "Error When Verify Your Account Please try again",
      400,
      "ERROR"
    );
    return next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const token = createToken(user, "15m");
    await sendVerificationEmail(user.email, token);

    res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (error) {
    next(error);
  }
};
const checkUserEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ status: true, message: "User is already exist" });
    } else {
      return res.status(200).json({ status: false, message: "User Not Found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  checkUserEmail,
};
