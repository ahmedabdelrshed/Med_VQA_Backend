const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createChat } = require('../controllers/chatControllers');
const {getChat}=require('../controllers/chatControllers')
const app = express();
const chatRouter = express.Router();

chatRouter.post('/createChat', verifyToken,createChat)
chatRouter.get("/getChat/:chatId",verifyToken, getChat);
module.exports = chatRouter;