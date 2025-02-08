const express = require("express");
const userSchema = require("../validations/userValidation");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const { register } = require("../controllers/userController");
const userRouter = express.Router();
userRouter.post("/register", userSchema(),register);

module.exports = userRouter;
