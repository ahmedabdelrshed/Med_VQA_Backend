const mongoose = require("mongoose");

const patientSugarSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  predictions: [{
    
    diabetes_status: {
      type: String,
      required: true, 
    },
    blood_sugar: {
      type: Number,
      required: true, 
        
    },
    time_of_measurement: {
      type: String,
      required: true, 
    },
    symptoms: {
      type: String,
      required: true, 
    },
    medication_taken: {
      type: String,
      required: true, 
    },
    physical_activity: {
      type: String,
      required: true,
    },
    last_meal_time: {
      type: String,
      required: true,
    },
    prediction_result: {
      type: String, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }]
});

module.exports = mongoose.model("SugarPatient", patientSugarSchema);
