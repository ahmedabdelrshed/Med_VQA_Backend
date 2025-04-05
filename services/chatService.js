const Chat = require("../models/chatModel");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");

 const checkChatExist = async (chatId, userId, next) => {
  try {
      const chatExists = await Chat.exists({ _id: chatId, userID: userId });
    if (!chatExists) {
      return next(appError.createError("Chat not found", 404, ERROR));
    }
      return true;
      
  } catch (error) {
    return next(appError.createError("Internal Server Error ", 400, ERROR));
  }
};
module.exports = {
    checkChatExist,
}