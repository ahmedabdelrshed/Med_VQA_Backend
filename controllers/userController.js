const User = require("../models/userModel");
const appError = require("../utils/appError");
const HealthRecord = require("../models/healthModel");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinaryConfig");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const {
  handlePasswordUpdate,
  validateNameLength,
  checkStrongPassword,
  createHashPassword,
} = require("../services/userService");
const createToken = require("../utils/createToken");
const { sendContactEmail } = require("../utils/SendVerificationEmail");

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

          let updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true,
          });
          let isHasHealthRecord = false;
          const healthRecord = await HealthRecord.findOne({ userId: user._id });
          if (healthRecord) {
            isHasHealthRecord = true;
          }
          updatedUser = {
            id: updatedUser._id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            avatar: updatedUser.avatar,
            isHasHealthRecord,
          };
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
const deleteUserImage = async (req, res, next) => {
  try {
    const { userId } = req.currentUser;
    const user = await User.findById(userId);

    if (!user) {
      return next(appError.createError("User not found", 404, "ERROR"));
    }

    if (!user.avatar) {
      return res.json({ message: "No image to delete" });
    }

    await cloudinary.uploader.destroy(
      `med_VQA_Data/profile-pictures/${userId}`
    );
    user.avatar = "";
    await user.save();

    res.json({ message: "User image deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(appError.createError("User not found", 404, "ERROR"));
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
const contactUs = async (req, res, next) => {
  try {
    const { email, firstName, lastName, message } = req.body;

    if (!email || !firstName || !lastName || !message) {
      return next(
        appError.createError("All fields are required", 400, "ERROR")
      );
    }

    const result = await sendContactEmail(email, firstName, lastName, message);

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
  await sendResetPasswordEmail(email, token, res);
};
const resetPassword = async (req, res, next) => {
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
  deleteUserImage,
  getUser,
  contactUs,
  forgetPassword,
  resetPassword,
};
