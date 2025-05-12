const bpPatientStatus = require("../APIModelCaller/bpApiCaller");
const validatePatientPressureInput = require("../validations/validatePatientPressureInput"); 
const User = require("../models/userModel");
const calculateAge = require("../utils/calculateAge"); 
const BloodPressurePatient= require("../models/bloodPressureModel");
const calculateBMI = require("../utils/calculateBMI"); 
const moment = require("moment-timezone");

const predictBPPatient = async (req, res) => {
  const { userId } = req.currentUser;
  const patientData = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const Gender = user.gender;
  const Age = calculateAge(user.DateOfBirth); 
  const { Weight_kg, Height_cm } = patientData;


  const validationErrors = validatePatientPressureInput(patientData);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const BMI = calculateBMI(Weight_kg, Height_cm);

  const finalData = {
    ...patientData,
    Gender,
    Age,
    BMI,
  };

  try {
    const prediction = await bpPatientStatus(finalData);

    let patient = await BloodPressurePatient.findOne({ userID: userId });
    if (!patient) {
      patient = new BloodPressurePatient({
        userID: userId,
        predictions: [],
      });
    }

    const { gender, age, weight, height, ...predictionDataToSave } = finalData;
    patient.predictions.push({
      ...predictionDataToSave,
      prediction_result: prediction.prediction|| "Unknown result",
      createdAt: moment().tz("Africa/Cairo").toDate(),
    });

    await patient.save();

   const formattedPredictions = patient.predictions.map((p) => ({
      ...p._doc,
      createdAt: moment(p.createdAt)
        .tz("Africa/Cairo")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.status(200).json({
      message: "Prediction completed and patient saved.",
      data: {
        userID: patient.userID,
        predictions: formattedPredictions,
      },
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({
      message: "Error predicting or saving data.",
    });
  }
};

const getPressurePredictions = async (req, res) => {
  const { userId } = req.currentUser;
  const { startDate, endDate } = req.query;

  try {
    const patientRecord = await BloodPressurePatient.findOne({ userID: userId });

    if (!patientRecord) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({ message: "Please provide both startDate and endDate." });
    }

    let filteredPredictions = patientRecord.predictions;

    let start, end;
    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      start = lastWeek.toISOString().split("T")[0];
      end = today.toISOString().split("T")[0];
    }

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];

    filteredPredictions = filteredPredictions.filter((prediction) => {
      const predictionDate = formatDate(prediction.createdAt);
      return predictionDate >= start && predictionDate <= end;
    });

    const resultData = filteredPredictions.map(pred => ({
      createdAt: moment(pred.createdAt)
        .tz("Africa/Cairo")
        .format("YYYY-MM-DD HH:mm:ss"),
      result: pred.prediction_result,
    }));

    res.status(200).json({
      message: "Predictions fetched successfully.",
      data: resultData,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Error fetching predictions." });
  }
};

module.exports ={ predictBPPatient,getPressurePredictions};
