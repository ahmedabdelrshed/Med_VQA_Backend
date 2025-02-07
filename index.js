const express = require("express");
const connectDB = require("./DB/connectDB");
const userRouter = require("./Routes/userRoutes");
require("dotenv").config();
const app = express();

app.use(express.json());

const port = process.env.PORT;

connectDB();
app.get("/test", (req, res) => {
  res.send("API is running...");
});
app.use("/user", userRouter);
app.listen(port, () => {
  console.log("listening on port " + port);
});
