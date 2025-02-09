const express = require("express");
const userSchema = require("../validations/userValidation");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const { register } = require("../controllers/userController");
const { login } = require("../controllers/userController");
const {updateUser } = require("../controllers/userController");
const {upload,checkImageSize,saveImageToDisk} = require("../middlewares/upload");






const userRouter = express.Router();
    userRouter.post("/register", userSchema(),register);
    userRouter.post("/login",login);
    userRouter.patch("/update",upload.single("avatar"),checkImageSize, saveImageToDisk,  updateUser);

module.exports = userRouter;
