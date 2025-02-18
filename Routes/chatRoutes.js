const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  createChat,
  getAllChats,
  deleteChat,
  updateChat,
} = require("../controllers/chatControllers");
const { getChat } = require("../controllers/chatControllers");
const chatRouter = express.Router();

chatRouter
  .route("/")
  .post(verifyToken, createChat)
  .get(verifyToken, getAllChats);
chatRouter
  .route("/:chatId")
  .get(verifyToken, getChat)
  .delete(verifyToken, deleteChat)
  .patch(verifyToken, updateChat);

module.exports = chatRouter;
