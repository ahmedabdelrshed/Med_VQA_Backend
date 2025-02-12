const express = require("express");
const userSchema = require("../validations/userValidation");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const { register, verifyEmail, forgetPassword, resetPassword } = require("../controllers/userController");
const { login } = require("../controllers/userController");
const {updateUser } = require("../controllers/userController");
const {contactUs}=require("../controllers/userController");
const {upload,checkImageSize} = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");





const userRouter = express.Router();
    userRouter.post("/register", userSchema(),register);
    userRouter.post("/login",login);
    userRouter.patch("/update",verifyToken,upload.single("avatar"),checkImageSize,   updateUser);
    userRouter.get('/emailVerification/:token', verifyEmail);
userRouter.post("/contactUs", verifyToken, contactUs);
userRouter.post('/forgetPassword', forgetPassword)
userRouter.post('/reset-password/:token',resetPassword)
module.exports = userRouter;
