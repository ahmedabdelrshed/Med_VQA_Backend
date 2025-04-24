require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const appError = require("./appError");
const { ERROR } = require("./httpStatus");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, token) => {
  try {
    const url = `${process.env.FRONTEND_URL}/confirm_Verification_Email/${token}`;
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification Email",
      html: `
        <h1>Email Verification</h1>
        <p>You're almost there! Please verify your email address by clicking the link below:</p>
        <a href=${url}>Verify My Email</a>
        <p><strong>⚠️ This link is valid for only 15 minutes.</strong> If it expires, you'll need to request a new verification email.</p>
        <p>If you didn’t request this, please ignore this message.</p>
        <p>Best regards,<br>Team Med VQA GP</p>
      `,
    };

    await sgMail.send(message);
  } catch (error) {
    throw appError.createError(
      "Error Occurred While Sending Verification Email. Please Try Again.",
      400,
      ERROR
    );
  }
};

const sendContactEmail = async (email, firstName, lastName, messageContent) => {
  try {
    const message = {
      from: process.env.EMAIL, 
      replyTo: email, 
      to: process.env.EMAIL,   
      subject: "New Contact Us Message",
      text: `From: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${messageContent}`,
    };

    await sgMail.send(message);
    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send message" };
  }
};

module.exports = { sendVerificationEmail, sendContactEmail };
