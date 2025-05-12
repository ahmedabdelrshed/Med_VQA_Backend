
function calculateBMI(weight, height) {
  if (typeof weight !== 'number' || weight <= 0) {
    throw new Error("Invalid weight: Must be a positive number.");
  }
  if (typeof height !== 'number' || height <= 0) {
    throw new Error("Invalid height: Must be a positive number.");
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return bmi.toFixed(2);
}

module.exports = calculateBMI;
