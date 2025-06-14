const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const createToken = require("../../utils/createToken");
const axios = require("axios");
const HealthRecord = require("../../models/healthModel");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://med-vqa-backend.vercel.app/auth/google/callback",
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.gender.read",
        "https://www.googleapis.com/auth/user.birthday.read",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const peopleData = await axios.get(
          "https://people.googleapis.com/v1/people/me?personFields=genders,birthdays",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        let user = await User.findOne({ email: profile.emails[0].value });
        let token = "";
        if (!user) {
          user = "not found";
          token = "not found";
        } else {
          let isHasHealthRecord = false;
          const healthRecord = await HealthRecord.findOne({ userId: user._id });
          if (healthRecord) {
            isHasHealthRecord = true;
          }
          token = createToken(user);
          user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            isHasHealthRecord,
          };
        }

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
