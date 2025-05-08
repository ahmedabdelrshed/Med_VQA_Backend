const SugarPatient = require("../models/sugarModel");
const User = require("../models/userModel");
const calculateAge = require("../utils/calculateAge");
const predictPatientSugarStatus = require("../APIModelCaller/sugarApiCaller");
const validatePatientSugarInput = require("../validations/validatePatientData");

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
      prediction_result: prediction.predicted_general_health_sugar || "Unknown result",
      createdAt: new Date(),
    });

    await patient.save();

    res.status(200).json({
      message: "Prediction completed and patient saved.",
      data: {
        userID: patient.userID,
        predictions: patient.predictions,
      },
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Error predicting or saving data." });
  }
};

module.exports = { predictSugarPatient };
