const express = require("express");
const connectDB = require("./DB/connectDB");
const userRouter = require("./Routes/userRoutes");
const { ERROR } = require("./utils/httpStatus");
const passport = require("passport");
const authRouter = require("./Routes/authRoutes");
require("dotenv").config();
const app = express();
require("./Auth/authGoogle"); // Import Passport config for Google
require("./Auth/authGithub"); // Import AuthConfig for Github
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const port = process.env.PORT;

connectDB();
app.get("/test", (req, res) => {
  res.send("API is running...");
});
app.use("/user", userRouter);
app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({ status: error.statusText || ERROR, error: error.message || null });
});
app.use(passport.initialize());

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log("listening on port " + port);
});
