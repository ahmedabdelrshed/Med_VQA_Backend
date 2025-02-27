require("dotenv").config();
const nodemailer = require("nodemailer");
const appError = require("./appError");
const { ERROR } = require("./httpStatus");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/change_password/${token}`;
  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password Request",
    html: `
      <h1>Reset Password Request</h1>
      <p>You requested a password reset for your Med VQA account.</p>
      <p>Please click the following link to reset your password:</p>
      <a href=${url}>Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      `,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      throw appError.createError(
        "Error Occur When Send Reset Password Email Please try again",
        400,
        ERROR
      );
    }
  });
};

module.exports = sendResetPasswordEmail;
