const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );
    return token;
};

module.exports = createToken;
