const express = require("express");
const { predictSugarPatient, getPatientPredictions } = require("../controllers/patientController");
const verifyToken = require('../middlewares/verifyToken');


const patientRouter = express.Router();

patientRouter.post("/analyzeSugar",verifyToken,predictSugarPatient)
            .get("/getPredictions", verifyToken, getPatientPredictions);

module.exports = patientRouter;
