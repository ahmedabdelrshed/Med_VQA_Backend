const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { ADMIN, USER } = require("../utils/userRoles");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [USER, ADMIN],
    default: USER,
  },
});

module.exports = mongoose.model("User", userSchema);
