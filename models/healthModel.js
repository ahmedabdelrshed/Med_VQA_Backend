const mongoose = require('mongoose');
const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
    enum: ["Male", "Female"]
  },
  height_cm: {
    type: Number,
    required: true
  },
  weight_kg: {
    type: Number,
    required: true
  },
  
  has_diabetes: {
    type: Boolean,
    required: true,
    enum: [1, 0] // 1 for true, 0 for false
  },
  has_hypertension: {
    type: Boolean,
    required: true,
    enum: [1, 0] // 1 for true, 0 for false
  },
  is_smoker: {
    type: Boolean,
    required: true,
    enum: [1, 0] // 1 for true, 0 for false
  },
  has_heart_disease: {
    type: Boolean,
    required: true,
    enum: [1, 0] // 1 for true, 0 for false
  },
  activity_level: {
    type: String,
    required: true,
    enum: ["Low", "Moderate", "High"]
  },
  health_tier: {
    type: String,
    required: true,
    enum: ["Poor", "Fair", "Good", "Excellent"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
module.exports = HealthRecord;