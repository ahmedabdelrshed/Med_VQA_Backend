function validateHealthInputs(data) {
  const errors = [];

  const requiredFields = [
    "height_cm",
    "weight_kg",
    "has_diabetes",
    "has_hypertension",
    "has_heart_disease",
    "is_smoker",
    "activity_level"
  ];

  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`${field} is required`);
    }
  });

  if (data.height_cm !== undefined && (typeof data.height_cm !== 'number' || data.height_cm <= 0)) {
    errors.push("Invalid height_cm");
  }

  if (data.weight_kg !== undefined && (typeof data.weight_kg !== 'number' || data.weight_kg <= 0)) {
    errors.push("Invalid weight_kg");
  }

  ["has_diabetes", "has_hypertension", "has_heart_disease", "is_smoker"].forEach(field => {
    if (data[field] !== undefined && (data[field] !== 0 && data[field] !== 1)) {
      errors.push(`Invalid ${field} (must be 0:false or 1:true)`);
    }
  });

  const allowedActivityLevels = ["Low", "Medium", "High"];
  if (data.activity_level !== undefined && !allowedActivityLevels.includes(data.activity_level)) {
    errors.push("Invalid activity_level (must be: Low, Medium, High)");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = { validateHealthInputs };
