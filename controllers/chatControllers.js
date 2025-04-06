const Chat = require("../models/chatModel");
const appError = require("../utils/appError");
const { ERROR, FAIL, SUCCESS } = require("../utils/httpStatus");
const Question = require("../models/questionsModel");
const { v4: uuidv4 } = require("uuid");
const { checkChatExist } = require("../services/chatService");

const createChat = async (req, res, next) => {
  const { userId } = req.currentUser;
  try {
    const countsChatsExists = await Chat.countDocuments({ userID: userId });
    const defaultTitle = `New chat ${countsChatsExists + 1}`;
    const newChat = new Chat({ userID: userId, title: defaultTitle });
    await newChat.save();
    return res.status(201).json({
      status: "success",
      data: newChat,
    });
  } catch (error) {
    return next(appError.createError("Error when create Chat ", 400, error));
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
    await checkChatExist(chatId, req.currentUser.userId, next);
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
  const { chatId } = req.params;
  if (!chatId) {
    return next(appError.createError("Chat ID is required", 400, ERROR));
  }

  await checkChatExist(chatId, req.currentUser.userId, next);

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
const updateChat = async (req, res, next) => {
  const { chatId } = req.params;
  if (!chatId) {
    return next(appError.createError("Chat ID is required", 400, ERROR));
  }
  await checkChatExist(chatId, req.currentUser.userId, next);

  const { title } = req.body;
  if (!title) {
    return next(appError.createError("Title is required", 400, ERROR));
  }

  try {
    const existingChat = await Chat.findOne({
      userID: req.currentUser.userId,
      title,
      _id: { $ne: chatId },
    });

    if (existingChat) {
      return next(
        appError.createError("Chat title already exists", 400, ERROR)
      );
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { title },
      { new: true }
    );
    res.status(200).json({ status: SUCCESS, updatedChat });
  } catch (error) {
    next(
      appError.createError("An error occurred while updating chat", 500, ERROR)
    );
  }
};

const shareChat = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(appError.createError("Chat not found", 404, "NOT_FOUND"));
    }

    if (!chat.sharedId) {
      chat.sharedId = uuidv4();
      chat.isShared = true;
      await chat.save();
    }

    const sharedLink = `${process.env.BACKEND_URL}/shared-chat/${chat.sharedId}`;
    res.status(200).json({
      success: true,
      sharedLink,
    });
  } catch (error) {
    next(appError.createError("Error sharing chat", 500, ERROR, error));
  }
};

const getSharedChat = async (req, res, next) => {
  const { sharedId } = req.params;

  try {
    const chat = await Chat.findOne({ sharedId });
    if (!chat) {
      return next(
        appError.createError("Shared chat not found", 404, "NOT_FOUND")
      );
    }

    const questions = await Question.find({ chatId: chat._id });

    res.status(200).json({
      success: true,
      chat: {
        title: chat.title,
        questions,
      },
    });
  } catch (error) {
    next(appError.createError("Error fetching shared chat", 500, ERROR, error));
  }
};

module.exports = {
  createChat,
  getChat,
  getAllChats,
  deleteChat,
  updateChat,
  shareChat,
  getSharedChat,
};
