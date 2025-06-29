const SugarPatient = require("../models/sugarModel");
const User = require("../models/userModel");
const calculateAge = require("../utils/calculateAge");
const predictPatientSugarStatus = require("../APIModelCaller/sugarApiCaller");
const validatePatientSugarInput = require("../validations/validatePatientData");
const moment = require("moment-timezone");

const predictSugarPatient = async (req, res) => {
  const { userId } = req.currentUser;
  const patientData = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const gender = user.gender;
  const age = calculateAge(user.DateOfBirth);

  const finalData = {
    ...patientData,
    gender,
    age,
  };

  const validationErrors = validatePatientSugarInput(finalData);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const prediction = await predictPatientSugarStatus(finalData);

    let patient = await SugarPatient.findOne({ userID: userId });

    if (!patient) {
      patient = new SugarPatient({
        userID: userId,
        predictions: [],
      });
    }

    const { gender, age, ...predictionDataToSave } = finalData;

    patient.predictions.push({
      ...predictionDataToSave,
      prediction_result:
        prediction.predicted_general_health_sugar || "Unknown result",
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
    res.status(500).json({ message: "Error predicting or saving data." });
  }
};

const getPatientPredictions = async (req, res) => {
  const { userId } = req.currentUser;
  const { startDate, endDate } = req.query;

  try {
    const patientRecord = await SugarPatient.findOne({ userID: userId });

    if (!patientRecord) {
      res.status(200).json({
        message: "Predictions fetched successfully.",
        data: [],
      });
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res
        .status(400)
        .json({ message: "Please provide both startDate and endDate." });
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

    const resultData = filteredPredictions.map((pred) => ({
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

module.exports = { predictSugarPatient, getPatientPredictions };
