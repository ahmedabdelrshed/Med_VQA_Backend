const express = require("express");
const connectDB = require("./DB/connectDB");
const userRouter = require("./Routes/userRoutes");
const { ERROR } = require("./utils/httpStatus");
const passport = require("passport");
const authRouter = require("./Routes/authRoutes");
const chatRouter = require("./Routes/chatRoutes");
const questionRouter = require("./Routes/questionsRoutes");
const patientRouter = require("./Routes/patientRoutes");
const bpRouter= require("./Routes/bloodPressureRotes");

const cors = require("cors");
require("dotenv").config();
const app = express();
require("./config/Auth/authGoogle");
require("./config/Auth/authGithub");
app.use(express.json());
const port = process.env.PORT;
app.use(
  cors({
    origin: [
      `${process.env.FRONTEND_URL}`,
      "https://medicalvqa.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
connectDB();

app.use("/user", userRouter);
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/question", questionRouter);


app.use("/api/sugarPatient", patientRouter);
app.use("/api/bloodPressurePatient", bpRouter);

app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({ status: error.statusText || ERROR, error: error.message || null });
});
app.listen(port, () => {
  console.log("listening on port " + port);
});
