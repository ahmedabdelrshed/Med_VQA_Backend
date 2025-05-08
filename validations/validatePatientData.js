const {
    GENDER,
    DIABETES_STATUS,
    TIME_OF_MEASUREMENT,
    SYMPTOMS,
    MEDICATION_TAKEN,
    PHYSICAL_ACTIVITY,
    LAST_MEAL_TIME,
  } = require("../utils/patientConstants");
  
  function validatePatientSugarInput(data) {
    const errors = [];
  
    if (!data.gender) {
      errors.push({ field: "gender", message: "Gender is required." });
    } else if (!GENDER.includes(data.gender)) {
      errors.push({
        field: "gender",
        message: `Invalid gender. Allowed values: ${GENDER.join(", ")}`,
      });
    }
  
    if (!data.diabetes_status) {
      errors.push({ field: "diabetes_status", message: "Diabetes status is required." });
    } else if (!DIABETES_STATUS.includes(data.diabetes_status)) {
      errors.push({
        field: "diabetes_status",
        message: `Invalid diabetes_status. Allowed values: ${DIABETES_STATUS.join(", ")}`,
      });
    }
  
    if (!data.time_of_measurement) {
      errors.push({ field: "time_of_measurement", message: "Time of measurement is required." });
    } else if (!TIME_OF_MEASUREMENT.includes(data.time_of_measurement)) {
      errors.push({
        field: "time_of_measurement",
        message: `Invalid time_of_measurement. Allowed values: ${TIME_OF_MEASUREMENT.join(", ")}`,
      });
    }
  
    if (!data.symptoms) {
      errors.push({ field: "symptoms", message: "Symptoms are required." });
    } else if (!SYMPTOMS.includes(data.symptoms)) {
      errors.push({
        field: "symptoms",
        message: `Invalid symptoms. Allowed values: ${SYMPTOMS.join(", ")}`,
      });
    }
  
    if (!data.medication_taken) {
      errors.push({ field: "medication_taken", message: "Medication status is required." });
    } else if (!MEDICATION_TAKEN.includes(data.medication_taken)) {
      errors.push({
        field: "medication_taken",
        message: `Invalid medication_taken. Allowed values: ${MEDICATION_TAKEN.join(", ")}`,
      });
    }
  
    if (!data.physical_activity) {
      errors.push({ field: "physical_activity", message: "Physical activity is required." });
    } else if (!PHYSICAL_ACTIVITY.includes(data.physical_activity)) {
      errors.push({
        field: "physical_activity",
        message: `Invalid physical_activity. Allowed values: ${PHYSICAL_ACTIVITY.join(", ")}`,
      });
    }
  
    if (!data.last_meal_time) {
      errors.push({ field: "last_meal_time", message: "Last meal time is required." });
    } else if (!LAST_MEAL_TIME.includes(data.last_meal_time)) {
      errors.push({
        field: "last_meal_time",
        message: `Invalid last_meal_time. Allowed values: ${LAST_MEAL_TIME.join(", ")}`,
      });
    }
  
    if (data.age === undefined || data.age === null || data.age === "") {
      errors.push({ field: "age", message: "Age is required." });
    } else if (typeof data.age !== "number" || data.age <= 0) {
      errors.push({ field: "age", message: "Age must be a positive number." });
    }
  
    if (data.blood_sugar === undefined || data.blood_sugar === null || data.blood_sugar === "") {
      errors.push({ field: "blood_sugar", message: "Blood sugar is required." });
    } else if (typeof data.blood_sugar !== "number" || data.blood_sugar <= 0) {
      errors.push({ field: "blood_sugar", message: "Blood sugar must be a positive number." });
    }
  
    return errors;
  }
  
  
  module.exports = validatePatientSugarInput;
  