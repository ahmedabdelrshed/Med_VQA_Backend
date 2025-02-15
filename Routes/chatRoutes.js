const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createChat } = require('../controllers/chatControllers');
const app = express();
const chatRouter = express.Router();

chatRouter.post('/', verifyToken,createChat)

module.exports = chatRouter;