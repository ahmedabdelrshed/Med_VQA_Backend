const { 
  SMOKING_STATUS, 
  PHYSICAL_ACTIVITY_LEVEL, 
  KNOWN_MEDICAL_CONDITIONS, 
  STRESS_LEVEL, 
  SYMPTOMS_NOW, 
  HISTORY_OF_HIGH_BP, 
} = require("../utils/patientConstants");


function validatePatientPressureInput(data) {
  const errors = [];



  // Validate Weight
  if (data.Weight_kg === undefined || data.Weight_kg === null || data.Weight_kg === "") {
    errors.push({ field: "Weight_kg", message: "Weight is required." });
  } else if (typeof data.Weight_kg !== "number" || data.Weight_kg <= 0 || data.Weight_kg < 30 || data.Weight_kg > 200) {
    errors.push({ field: "Weight_kg", message: "Weight must be a positive number between 30 and 200." });
  }

  // Validate Height
  if (data.Height_cm === undefined || data.Height_cm === null || data.Height_cm === "") {
    errors.push({ field: "Height_cm", message: "Height is required." });
  } else if (typeof data.Height_cm !== "number" || data.Height_cm <= 0 || data.Height_cm < 100 || data.Height_cm > 250) {
    errors.push({ field: "Height_cm", message: "Height must be a positive number between 100 and 250." });
  }

  // Validate Smoking Status
  if (!data.Smoking_Status) {
    errors.push({ field: "Smoking_Status", message: "Smoking status is required." });
  } else if (!SMOKING_STATUS.includes(data.Smoking_Status)) {
    errors.push({ field: "Smoking_Status", message: `Invalid smoking status. Allowed values: ${SMOKING_STATUS.join(", ")}` });
  }

  // Validate Physical Activity Level
  if (!data.Physical_Activity_Level) {
    errors.push({ field: "Physical_Activity_Level", message: "Physical activity level is required." });
  } else if (!PHYSICAL_ACTIVITY_LEVEL.includes(data.Physical_Activity_Level)) {
    errors.push({ field: "Physical_Activity_Level", message: `Invalid physical activity level. Allowed values: ${PHYSICAL_ACTIVITY_LEVEL.join(", ")}` });
  }

  // Validate Known Medical Conditions
  if (!data.Known_Medical_Conditions) {
    errors.push({ field: "Known_Medical_Conditions", message: "Known medical conditions are required." });
  } else if (!KNOWN_MEDICAL_CONDITIONS.includes(data.Known_Medical_Conditions)) {
    errors.push({ field: "Known_Medical_Conditions", message: `Invalid medical condition. Allowed values: ${KNOWN_MEDICAL_CONDITIONS.join(", ")}` });
  }

  // Validate Stress Level
  if (!data.Stress_Level) {
    errors.push({ field: "Stress_Level", message: "Stress level is required." });
  } else if (!STRESS_LEVEL.includes(data.Stress_Level)) {
    errors.push({ field: "Stress_Level", message: `Invalid stress level. Allowed values: ${STRESS_LEVEL.join(", ")}` });
  }

  // Validate Symptoms Now
  if (!data.Symptoms_Now) {
    errors.push({ field: "Symptoms_Now", message: "Symptoms now is required." });
  } else if (!SYMPTOMS_NOW.includes(data.Symptoms_Now)) {
    errors.push({ field: "Symptoms_Now", message: `Invalid symptoms. Allowed values: ${SYMPTOMS_NOW.join(", ")}` });
  }

  // Validate History of High Blood Pressure
  if (!data.History_of_High_BP) {
    errors.push({ field: "History_of_High_BP", message: "History of high blood pressure is required." });
  } else if (!HISTORY_OF_HIGH_BP.includes(data.History_of_High_BP)) {
    errors.push({ field: "History_of_High_BP", message: `Invalid history of high blood pressure. Allowed values: ${HISTORY_OF_HIGH_BP.join(", ")}` });
  }

  // Validate Heart Rate
  if (!data.Heart_Rate_BPM) {
    errors.push({ field: "Heart_Rate_BPM", message: "Heart rate (BPM) is required." });
  } else if (typeof data.Heart_Rate_BPM !== "number" ||data.Heart_Rate_BPM <= 0 ||data.Heart_Rate_BPM < 30 || data.Heart_Rate_BPM > 200) {
    errors.push({ field: "Heart_Rate_BPM", message: "Heart rate must be a positive number between 30 and 200 BPM." });
  }

  // Validate Systolic Blood Pressure
  if (!data.Systolic_BP) {
    errors.push({ field: "Systolic_BP", message: "Systolic blood pressure is required." });
  } else if (typeof data.Systolic_BP !== "number" ||data.Systolic_BP <= 0|| data.Systolic_BP < 50 || data.Systolic_BP > 200) {
    errors.push({ field: "Systolic_BP", message: "Systolic blood pressure must be a positive number between 50 and 200." });
  }

  // Validate Diastolic Blood Pressure
  if (!data.Diastolic_BP) {
    errors.push({ field: "Diastolic_BP", message: "Diastolic blood pressure is required." });
  } else if (typeof data.Diastolic_BP !== "number" ||data.Diastolic_BP <= 0|| data.Diastolic_BP < 30 || data.Diastolic_BP > 130) {
    errors.push({ field: "Diastolic_BP", message: "Diastolic blood pressure must be a positive number between 30 and 130." });
  }

  return errors;
}

module.exports = validatePatientPressureInput;
