const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const createToken = require("../../utils/createToken");
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // Your GitHub Client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Your GitHub Client Secret
      callbackURL: "/auth/github/callback",
      scope: ["user:email"], // Ensure this scope is included
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            firstName: profile.displayName.split(" ")[0],
            lastName: profile.displayName.split(" ")[1],
            email: profile.emails[0].value,
            isVerified: true,
          });
          await user.save();
        }
        const token = createToken(user);
        user = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
        }
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
