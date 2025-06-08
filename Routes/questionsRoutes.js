const express = require("express");
const upload  = require("../middlewares/uploadQuestion");
const { addQuestionWithImage,addQuestionWithSymptoms, updateQuestion, deleteQuestion } = require("../controllers/questionController");
const verifyToken = require('../middlewares/verifyToken');
const validateSymptoms = require("../validations/symptomValidator");
const router = express.Router();


router.post("/questionImage/:chatId",verifyToken, upload.single("image"), addQuestionWithImage);
router.post("/questionSymptoms/:chatId",verifyToken,validateSymptoms ,addQuestionWithSymptoms);

router.route("/:questionId")
        .patch(verifyToken, updateQuestion)
        .delete(verifyToken, deleteQuestion);

module.exports = router;