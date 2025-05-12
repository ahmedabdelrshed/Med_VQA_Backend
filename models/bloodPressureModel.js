const mongoose = require("mongoose");

const bloodPressurePatientSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    predictions: [
      {
        Weight_kg: {
          type: Number,
          required: true,
        },
        Height_cm: {
          type: Number,
          required: true,
        },
        Smoking_Status: {
          type: String,
          required: true,
        },
        Physical_Activity_Level: {
          type: String,
          required: true,
        },
        Known_Medical_Conditions: {
          type: String,
          required: true,
        },
        Stress_Level: {
          type: String,
          required: true,
        },
        Symptoms_Now: {
          type: String,
          required: true,
        },
        History_of_High_BP: {
          type: String,
          required: true,
        },
        Heart_Rate_BPM: {
          type: Number,
          required: true,
        },
        Systolic_BP: {
          type: Number,
          required: true,
        },
        Diastolic_BP: {
          type: Number,
          required: true,
        },
        prediction_result: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
        },
      },
    ],
  },
);

module.exports = mongoose.model("BloodPressurePatient", bloodPressurePatientSchema);
