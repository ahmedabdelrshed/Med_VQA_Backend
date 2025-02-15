const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      appError.createError("Token is required", 401, "AUTHENTICATION_ERROR")
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    
    throw  appError.createError(
        "Invalid or expired session",
        403,
        "AUTHENTICATION_ERROR"
      )
    
  }
};

module.exports = verifyToken;
