const express = require("express");
const {
  verifyEmail,
  forgetPassword,
  resetPassword,
  resendVerificationEmail,
  checkUserEmail,
} = require("../controllers/userController");
const { updateUser } = require("../controllers/userController");
const { contactUs } = require("../controllers/userController");
const { upload, checkImageSize } = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");

const userRouter = express.Router();

userRouter.patch(
  "/update",
  verifyToken,
  upload.single("avatar"),
  checkImageSize,
  updateUser
);
userRouter.get("/emailVerification",verifyToken, verifyEmail);
userRouter.post("/resendVerification", resendVerificationEmail);
userRouter.post("/checkEmail", checkUserEmail);
userRouter.post("/contactUs", verifyToken, contactUs);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.post("/reset-password", verifyToken, resetPassword);
module.exports = userRouter;
