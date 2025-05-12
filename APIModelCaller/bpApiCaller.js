const axios = require("axios");

const axiosInstance = axios.create({
  timeout: 10000,
});

const apiUrl = process.env.BP_MODEL_API_URL || "https://a7med95-blood-pressure.hf.space/predict"; 

async function bpPatientStatus(patientData) {
  try {
    const response = await axiosInstance.post(apiUrl, patientData);
    return response.data;
  } catch (error) {
    console.error("Prediction API Error:", error.message);
    throw error;
  }
}

module.exports = bpPatientStatus;
