const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");
const Question = require("../models/questionsModel");

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

const getChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return next(
        appError.createError("Chat ID is required", 400, "VALIDATION_ERROR")
      );
    }

    const chatExists = await Chat.exists({ _id: chatId });
    if (!chatExists) {
      return next(appError.createError("Chat not found", 404, "NOT_FOUND"));
    }

    const questions = await Question.find({ chatId });

    if (questions.length === 0) {
      return next(
        appError.createError(
          "No questions found for this chat ID",
          404,
          "NOT_FOUND"
        )
      );
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(
      appError.createError(
        "An error occurred while fetching questions",
        500,
        "SERVER_ERROR",
        error
      )
    );
  }
};

const getAllChats = async (req, res, next) => {
  const { userId } = req.currentUser;
  const userExist = await User.findOne({ _id: userId });
  if (!userExist) {
    return next(appError.createError("User not found", 400, ERROR));
  }
  try {
    const chats = await Chat.find({ userID: userId }).sort({ createdAt: -1 });
    res.status(200).json({
    success: true,
    data: chats,
    });
  } catch (error) {
    next(
      appError.createError("An error occurred while fetching chats", 500, ERROR)
    );
  }
};

module.exports = { createChat, getChat ,getAllChats};
