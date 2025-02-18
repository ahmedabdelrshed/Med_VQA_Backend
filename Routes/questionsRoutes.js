const express = require("express");
const upload  = require("../middlewares/uploadQuestion");
const { addQuestion } = require("../controllers/questionController");
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();


router.post("/:chatId",verifyToken, upload.single("image"), addQuestion);

module.exports = router;