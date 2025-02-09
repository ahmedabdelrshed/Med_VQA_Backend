const express = require("express");
const connectDB = require("./DB/connectDB");
const userRouter = require("./Routes/userRoutes");
const { ERROR } = require("./utils/httpStatus");
require("dotenv").config();
const app = express();

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
app.listen(port, () => {
  console.log("listening on port " + port);
});
