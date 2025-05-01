const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  createChat,
  getAllChats,
  deleteChat,
  updateChat,
  shareChat,
  getSharedChat,
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

chatRouter.post("/share/:chatId",verifyToken, shareChat);
chatRouter.get("/shared-chat/:sharedId", getSharedChat);

module.exports = chatRouter;
