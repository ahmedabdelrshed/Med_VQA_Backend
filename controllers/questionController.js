const Question = require("../models/questionsModel");
const appError = require("../utils/appError");
const Chat = require("../models/chatModel");
const addQuestion = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { question } = req.body;
  
      if (!question || question.length < 5) {
        return next(appError.createError("Question is required and must be at least 5 characters long", 400, "VALIDATION_ERROR"));
      }
  
      if (!chatId) {
        return next(appError.createError("Chat ID is required", 400, "VALIDATION_ERROR"));
      }
        const chatExists = await Chat.exists({ _id: chatId });
        if (!chatExists) {
          return next(appError.createError("Chat not found", 404, "NOT_FOUND"));
        }

  
      if (!req.file) {
        return next(appError.createError("Image is required", 400, "VALIDATION_ERROR"));
      }
  
      const imageUrl = req.file.path;
  
      const newQuestion = new Question({ 
        chatId,
        question,
         imageUrl,
        answer:"this is a default answer" });
      await newQuestion.save();
  
      res.status(201).json({
        success: true,
        message: "Question added successfully",
        data: newQuestion,
      });
    } catch (error) {
      next(appError.createError("An error occurred while adding the question", 500, "SERVER_ERROR", error));
    }
  };
  



module.exports = {
  addQuestion,
};