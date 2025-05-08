const SugarPatient = require("../models/sugarModel");
const predictPatientSugarStatus = require("../APIModelCaller/sugarApiCaller");
const validatePatientSugarInput = require("../validations/validatePatientData");

const predictSugarPatient = async (req, res) => {
  const patientData = req.body;
  const { userId } = req.currentUser; 

  const validationErrors = validatePatientSugarInput(patientData);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const prediction = await predictPatientSugarStatus(patientData);

    let patient = await SugarPatient.findOne({ userID: userId });

    if (!patient) {
      patient = new SugarPatient({
        userID: userId,
        predictions: [],
      });
    }

    patient.predictions.push({
      ...patientData,
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
