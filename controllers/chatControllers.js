const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");
const createChat = async (req, res, next) => {
  const { userId } = req.currentUser;
  const title = req.body.title;
  if (!title) {
    const error = appError.createError("Title is required", 400, ERROR);
    return next(error);
  }
  const userExist = await User.findOne({ _id: userId });
  if (!userExist) {
    throw appError.createError("User not found", 400, ERROR);
  }
  const chatExist = await Chat.findOne({ title, userID: userId });
  if (chatExist) {
    return next(
      appError.createError("Chat with this title already exists", 400, ERROR)
    );
  }
  try {
    const newChat = new Chat({ userID: userId, title });
    await newChat.save();
    return res.status(201).json({
      status: "success",
      data: newChat,
    });
  } catch (error) {
    return next(appError.createError("Error when create Chat ", 400, ERROR));
  }
};

module.exports = { createChat };
