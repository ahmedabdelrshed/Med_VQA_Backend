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
        const gender = peopleData.data.genders?.[0]?.value;
        const birthday = peopleData.data.birthdays?.[0]?.date;
        const date = new Date(
          Date.UTC(birthday.year, birthday.month - 1, birthday.day)
        );

        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            isVerified: true,
            gender: gender.charAt(0).toUpperCase() + gender.slice(1),
            DateOfBirth: date.toISOString(),
            password: "",
            avatar: profile.photos[0].value,
          });
          await user.save();
        }
    let isHasHealthRecord = false;
    const healthRecord = await HealthRecord.findOne({ userId: user._id });
    if (healthRecord) {
      isHasHealthRecord = true;
    }
        const token = createToken(user);
        user = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          isHasHealthRecord
        };

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
