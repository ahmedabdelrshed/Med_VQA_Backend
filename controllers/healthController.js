const HealthRecord = require("../models/healthModel");
const User = require('../models/userModel');
const healthPatientStatus = require("../APIModelCaller/healthApiCaller");
const calculateAge = require('../utils/calculateAge');
const { validateHealthInputs } = require('../validations/validateHealthData');

async function createOrUpdateHealthRecord(req, res) {
  try {
    const { userId } = req.currentUser;
    const patientData = req.body;

    // Validation
    const { isValid, errors } = validateHealthInputs(patientData);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const Gender = user.gender;
    const Age = calculateAge(user.DateOfBirth);

    const modelInput = {
      ...patientData,
      age: Age,
      sex: Gender,
    };

    const modelResult = await healthPatientStatus(modelInput);
    const health_tier = modelResult.health_tier_prediction;

    const updatedHealthRecord = await HealthRecord.findOneAndUpdate(
      { userId }, 
      {
        userId,
        age: Age,
        sex: Gender,
        height_cm: patientData.height_cm,
        weight_kg: patientData.weight_kg,
        has_diabetes: patientData.has_diabetes,
        has_hypertension: patientData.has_hypertension,
        is_smoker: patientData.is_smoker,
        has_heart_disease: patientData.has_heart_disease,
        activity_level: patientData.activity_level,
        health_tier,
      },
      {
        new: true,     
        upsert: true,  
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: "Health record created or updated successfully",
      health_status: updatedHealthRecord.health_tier,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


async function getHealthRecord(req, res) {
  try {
    const { userId } = req.currentUser;

    const healthRecord = await HealthRecord.findOne({ userId });

    if (!healthRecord) {
      return res.status(200).json({
        success: true,
        message: "No health record found",
        data: {},
      });
    }

    const { age, sex, ...filteredRecord } = healthRecord.toObject();

    res.status(200).json({
      success: true,
      message: "Health record retrieved successfully",
      data: filteredRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}





module.exports = { createOrUpdateHealthRecord, getHealthRecord };
