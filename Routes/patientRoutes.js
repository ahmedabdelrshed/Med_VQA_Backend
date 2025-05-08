const express = require("express");
const router = express.Router();
const { predictSugarPatient } = require("../controllers/patientController");
const verifyToken = require('../middlewares/verifyToken');

router.post("/analyzeSugar",verifyToken,predictSugarPatient);

module.exports = router;
