const express = require("express");
const bpRouter = express.Router();
const {predictBPPatient,getPressurePredictions} = require("../controllers/bloodPressurePatientController");

const verifyToken = require("../middlewares/verifyToken");




bpRouter.post("/predict-blood-pressure", verifyToken, predictBPPatient)
        .get("/getPredictions", verifyToken, getPressurePredictions);
module.exports = bpRouter;
