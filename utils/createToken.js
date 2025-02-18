const jwt = require("jsonwebtoken");

const createToken = (user, expireDate) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: expireDate || "1d" }
  );
  return token;
};

module.exports = createToken;
