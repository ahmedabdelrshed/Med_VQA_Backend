const axios = require("axios");

const axiosInstance = axios.create({
  timeout: 10000,
  responseType: 'arraybuffer' 
});

const apiUrl = process.env.OBESITY_MODEL_API_URL || "https://a7med95-obesity-model.hf.space/predict";

async function obesityPatientStatus(patientData) {
  try {
    const response = await axiosInstance.post(apiUrl, patientData);
    return {
      prediction: response.headers['x-prediction'],
      pdfBuffer: response.data
    };
  } catch (error) {
    console.error("Prediction API Error:", error.message);
    throw error;
  }
}

module.exports = obesityPatientStatus;
