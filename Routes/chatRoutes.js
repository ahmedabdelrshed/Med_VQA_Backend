const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createChat, getAllChats } = require('../controllers/chatControllers');
const {getChat}=require('../controllers/chatControllers')
const app = express();
const chatRouter = express.Router();

chatRouter.post('/createChat', verifyToken,createChat)
chatRouter.get("/getChat/:chatId", verifyToken, getChat);
chatRouter.get('/',verifyToken,getAllChats)
module.exports = chatRouter;