const axios = require('axios');

async function getSymptomsDiseasePrediction(symptoms) {
  try {
    const response = await axios.post(
      'https://a7med95-symptoms-dieases-model.hf.space/predict',
      { symptoms }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return formatPredictionResponse(response.data); 
  } catch (error) {
    console.error('Prediction API error:', error.message);
    throw error;
  }
}
function formatPredictionResponse(data) {
  const {
    predicted_disease,
    description,
    precautions = [],
    medications = [],
    diets = [],
    workouts = [],
  } = data;

  return `
🩺 Predicted Disease: ${predicted_disease}
📝 Description: ${description}
💊 Recommended Medications: ${medications.join(', ').replace(/[\[\]']+/g, '')}
🥗 Suggested Diets: ${diets.join(', ').replace(/[\[\]']+/g, '')}
⚠️  Tips: ${precautions.slice(0, 2).join(', ')}
🏃 Lifestyle Tips: ${workouts.slice(0, 3).join(', ')}
`.trim();
}


module.exports = getSymptomsDiseasePrediction;