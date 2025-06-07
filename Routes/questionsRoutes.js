const express = require("express");
const upload  = require("../middlewares/uploadQuestion");
const { addQuestionWithImage, updateQuestion, deleteQuestion } = require("../controllers/questionController");
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();


router.post("/questionImage/:chatId",verifyToken, upload.single("image"), addQuestionWithImage);

router.route("/:questionId")
        .patch(verifyToken, updateQuestion)
        .delete(verifyToken, deleteQuestion);

module.exports = router;