const express = require("express");
const upload  = require("../middlewares/uploadQuestion");
const { addQuestion, updateQuestion, deleteQuestion } = require("../controllers/questionController");
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();


router.post("/:chatId",verifyToken, upload.single("image"), addQuestion);

router.route("/:questionId")
        .patch(verifyToken, updateQuestion)
        .delete(verifyToken, deleteQuestion);

module.exports = router;