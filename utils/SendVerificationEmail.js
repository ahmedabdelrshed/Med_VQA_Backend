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

const verificationEmail = async (email, token) => {
  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to: email,
    subject: "Verification Email",
    text: `Hello,

    You're almost there! Please verify your email address by clicking the link below:
    
    🔗 [Verify My Email](http://localhost:4000/user/emailVerification/${token})
    
    ⚠️ This link is valid for only **15 minutes**. If it expires, you'll need to request a new verification email.
    
    If you didn’t request this, please ignore this message.
    
    Best regards,  
    Team Med VQA GP `,
  };
  const info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw appError.createError(
        "Error Occur When Send Email Verification Please try again",
        400,
        ERROR
      );
    }
  });
};

module.exports = verificationEmail;
