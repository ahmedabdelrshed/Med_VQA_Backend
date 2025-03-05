const passport = require("passport");
const express = require("express");
const { register, login, verifyEmail, resendVerificationEmail, checkUserEmail } = require("../controllers/authController");
const userSchema = require("../validations/userValidation");
const verifyToken = require("../middlewares/verifyToken");
const authRouter = express.Router();

// �� Google OAuth
// http://localhost:4000/auth/google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.json({ token, message: "Google Authentication Success" });
    // 🔹 Redirect to frontend with JWT token
    // res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// �� GitHub OAuth
// http://localhost:4000/auth/github
authRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);
authRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.json({ token, message: "Github Authentication Success" });

    // 🔹 Redirect to frontend with JWT token
    // res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

authRouter.post("/register", userSchema(),register)
authRouter.post("/checkEmail", checkUserEmail);
authRouter.post("/login",login);

authRouter.get("/emailVerification",verifyToken, verifyEmail);
authRouter.post("/resendVerification", resendVerificationEmail);
module.exports = authRouter;
