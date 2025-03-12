require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const appError = require("./appError");
const { ERROR } = require("./httpStatus");

const sendResetPasswordEmail = async (email, token, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
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

    await sgMail.send(message).then(() => {
      res.json({ message: "Reset password link sent successfully" });
    });
  } catch (error) {
    throw appError.createError(
      "Error Occurred While Sending Reset Password Email. Please Try Again.",
      400,
      ERROR
    );
  }
};

module.exports = sendResetPasswordEmail;
