const express = require("express");
const { getQuestionsByChatId } = require("../controllers/questionController");
const { upload } = require("../utils/cloudinaryConfig");
const { addQuestion } = require("../controllers/questionController");
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();


router.post("/add/:chatId",verifyToken, upload.single("image"), addQuestion);

module.exports = router;