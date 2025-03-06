const mongoose = require("mongoose");
const { isEmail } = require("validator");
const roles = require("../utils/userRoles");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your FirstName"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your lastName"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: [...roles],
    default: 'USER',
  },
  avatar:{
    type:String,
    default:''
  },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
