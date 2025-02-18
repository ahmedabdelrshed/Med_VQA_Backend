const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const appError = require("../utils/appError");
const { ERROR, FAIL ,SUCCESS} = require("../utils/httpStatus");
const Question = require("../models/questionsModel");
const { checkUserExist } = require("../services/userService");

const createChat = async (req, res, next) => {
  const { email } = req.currentUser;
  checkUserExist(email,next)
  try {
    const countsChatsExists = await Chat.countDocuments({ userID: userId }) 
    const defaultTitle= `New chat ${countsChatsExists + 1}`
    const newChat = new Chat({ userID: userId, title : defaultTitle});
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
    const { email } = req.currentUser;
    checkUserExist(email,next)
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
  const { email } = req.currentUser;
  checkUserExist(email,next)
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

const deleteChat = async (req, res, next) => {
  const { email } = req.currentUser;
  checkUserExist(email,next)
  const { chatId } = req.params;
  if (!chatId) {
    return next(appError.createError("Chat ID is required", 400, ERROR));
  }

  const chatExists = await Chat.exists({ _id: chatId });
  if (!chatExists) {
    return next(appError.createError("Chat not found", 404, FAIL));
  }
  try {
    await Question.deleteMany({ chatId });
    await Chat.findByIdAndDelete(chatId);
    res
      .status(200)
      .json({ success: true, message: "Deleted chat successfully ✅" });
  } catch (error) {
    next(
      appError.createError("An error occurred while deleting chat", 500, ERROR)
    );
  }
};
const updateChat = async(req,res,next) => {
  const { email } = req.currentUser;
  checkUserExist(email,next)
  const { chatId } = req.params;
  if (!chatId) {
    return next(appError.createError("Chat ID is required", 400, ERROR));
  }
  const chatExists = await Chat.exists({ _id: chatId });
  if (!chatExists) {
    return next(appError.createError("Chat not found", 404, FAIL));
  }
  const { title } = req.body;
  if (!title) {
    return next(appError.createError("Title is required", 400, ERROR));
  }
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
       { title },
       { new: true });
    res.status(200).json({status:SUCCESS, updatedChat});
} catch (error) {
    next(
      appError.createError("An error occurred while updating chat", 500, ERROR)
    );
  }
};

module.exports = { createChat, getChat, getAllChats ,deleteChat,updateChat};
