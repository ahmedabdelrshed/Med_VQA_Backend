const User = require("../models/userModel");
const { ERROR } = require("../utils/httpStatus");
const appError = require("../utils/appError");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinaryConfig");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const {
  handlePasswordUpdate,
  validateNameLength,
} = require("../services/userService");
const createToken = require("../utils/createToken");

const updateUser = async (req, res, next) => {
  try {
    const { email, userId } = req.currentUser;
    const user = await User.findById(userId).select("+password");

    if (req.body.email) {
      return next(
        appError.createError("Email cannot be updated", 400, "ERROR")
      );
    }

    await handlePasswordUpdate(req.body, user);
    validateNameLength(req.body);

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "med_VQA_Data/profile-pictures", public_id: userId },

        async (error, result) => {
          if (error) {
            return next(
              appError.createError("Cloudinary Upload Failed", 500, "ERROR")
            );
          }

          req.body.avatar = result.secure_url;

          const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true,
          });

          if (!updatedUser) {
            return next(
              appError.createError("User update failed", 500, "ERROR")
            );
          }

          res.json({
            message: "Profile updated successfully",
            updatedUser,
          });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return next(appError.createError("User update failed", 500, "ERROR"));
      }

      res.json({
        message: "Profile updated successfully",
        updatedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

const contactUs = async (req, res, next) => {
  try {
    const userEmail = req.currentUser?.email;
    const message = req.body?.message;

    if (!message) {
      return next(appError.createError("Message is required", 400, "ERROR"));
    }

    const result = await contactEmail(userEmail, message);

    if (!result.success) {
      return next(appError.createError(result.message, 500, "ERROR"));
    }

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const token = createToken(user, "10m");
  await sendResetPasswordEmail(email, token);
  res.json({ message: "Reset password link sent successfully" });
};
const resetPassword = async (req, res,next) => {
  try {
    const email = req.currentUser.email;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "Password is required" });
    }
    checkStrongPassword(newPassword, next);
    const user = await User.findOne({ email });
    const hashedPassword = await createHashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};



module.exports = {
  updateUser,
  contactUs,
  forgetPassword,
  resetPassword,

};
