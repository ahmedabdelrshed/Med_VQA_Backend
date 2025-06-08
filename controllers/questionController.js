const Question = require("../models/questionsModel");
const appError = require("../utils/appError");
const Chat = require("../models/chatModel");
const getSymptomsDiseasePrediction = require("../APIModelCaller/symptomsApi");

const addQuestionWithImage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { response } = req.body;
    if (!chatId) {
      return next(
        appError.createError("Chat ID is required", 400, "VALIDATION_ERROR")
      );
    }
    const chatExists = await Chat.exists({ _id: chatId });
    if (!chatExists) {
      return next(appError.createError("Chat not found", 404, "NOT_FOUND"));
    }

    if (!req.file) {
      return next(
        appError.createError("Image is required", 400, "VALIDATION_ERROR")
      );
    }
    if (!response) {
      return next(
        appError.createError("Response is required", 400, "VALIDATION_ERROR")
      );
    }

    const imageUrl = req.file.path;
    const newQuestion = new Question({
      chatId,
      imageUrl,
      answer: response,
    });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    next(
      appError.createError(
        "An error occurred while adding the question",
        500,
        "SERVER_ERROR",
        error
      )
    );
  }
};

const addQuestionWithSymptoms = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { symptoms } = req.body;
    if (!chatId) {
      return next(
        appError.createError("Chat ID is required", 400, "VALIDATION_ERROR")
      );
    }
    const chatExists = await Chat.exists({ _id: chatId });
    if (!chatExists) {
      return next(appError.createError("Chat not found", 404, "NOT_FOUND"));
    }

    if (!symptoms || symptoms.length === 0) {
      return next(
        appError.createError("Symptoms are required", 400, "VALIDATION_ERROR")
      );
    }
    const response = await getSymptomsDiseasePrediction(symptoms);
    const newQuestion = new Question({
      chatId,
      symptoms: `You have selected the following symptoms: ${symptoms.join(
        ", "
      )}`,
      answer: response,
      type: "Symptoms",
    });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    next(
      appError.createError(
        "An error occurred while adding the question",
        500,
        "SERVER_ERROR",
        error
      )
    );
  }
};
const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { question } = req.body;

    if (question.length < 5) {
      return next(
        appError.createError(
          "Question must be at least 5 characters long",
          400,
          "VALIDATION_ERROR"
        )
      );
    }

    if (!questionId) {
      return next(
        appError.createError("Question ID is required", 400, "VALIDATION_ERROR")
      );
    }

    const existingQuestion = await Question.findByIdAndUpdate(
      questionId,
      { question, answer: "this is a new answer" },

      { new: true }
    );

    if (!existingQuestion) {
      return next(appError.createError("Question not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: existingQuestion,
    });
  } catch (error) {
    next(
      appError.createError(
        "An error occurred while updating the question",
        500,
        "SERVER_ERROR",
        error
      )
    );
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return next(
        appError.createError("Question ID is required", 400, "VALIDATION_ERROR")
      );
    }
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return next(appError.createError("Question not found", 404, "NOT_FOUND"));
    }
    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    next(
      appError.createError(
        "An error occurred while deleting the question",
        500,
        "SERVER_ERROR",
        error
      )
    );
  }
};

module.exports = {
  addQuestionWithImage,
  addQuestionWithSymptoms,
  updateQuestion,
  deleteQuestion,
};
