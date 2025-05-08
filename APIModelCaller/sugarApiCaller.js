const axios = require("axios");

const axiosInstance = axios.create({
    timeout: 10000,
  });
  const apiUrl = process.env.SUGAR_MODEL_API_URL || "https://a7med95-sugar-model.hf.space/predict";
  async function sugarPatientStatus(patientData) {
    try {
    const response = await axiosInstance.post(apiUrl, patientData);
      return response.data;
    } catch (error) {
      console.error("Prediction API Error:", error.message);
      throw error;
    }
  }

module.exports = sugarPatientStatus;
