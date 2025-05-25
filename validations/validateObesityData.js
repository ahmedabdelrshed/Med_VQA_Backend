const {
  FAMILY_HISTORY,
  FAVC,
  CAEC,
  SMOKE,
  SCC,
  CALC,
  MTRANS
} = require("../utils/patientConstants");

function validateObesityInput(data) {
  const errors = [];

  // Validate Height
  if (data.Height === undefined || data.Height === null || data.Height === "") {
    errors.push({ field: "Height", message: "Height is required." });
  } else if (typeof data.Height !== "number" || data.Height <= 0 || data.Height < 1.0 || data.Height > 2.5) {
    errors.push({ field: "Height", message: "Height must be a positive number between 1.0 and 2.5 meters." });
  }

  // Validate Weight
  if (data.Weight === undefined || data.Weight === null || data.Weight === "") {
    errors.push({ field: "Weight", message: "Weight is required." });
  } else if (typeof data.Weight !== "number" || data.Weight <= 0 || data.Weight < 30 || data.Weight > 200) {
    errors.push({ field: "Weight", message: "Weight must be a positive number between 30 and 200 kg." });
  }

  // Validate Family History
  if (!data.family_history) {
    errors.push({ field: "family_history", message: "Family history is required." });
  } else if (!FAMILY_HISTORY.includes(data.family_history)) {
    errors.push({ field: "family_history", message: `Invalid family history value. Allowed values: ${FAMILY_HISTORY.join(", ")}` });
  }

  // Validate FAVC (Frequent consumption of high caloric food)
  if (!data.FAVC) {
    errors.push({ field: "FAVC", message: "FAVC is required." });
  } else if (!FAVC.includes(data.FAVC)) {
    errors.push({ field: "FAVC", message: `Invalid FAVC value. Allowed values: ${FAVC.join(", ")}` });
  }

  // Validate FCVC (Frequency of consumption of vegetables)
  if (data.FCVC === undefined || data.FCVC === null || data.FCVC === "") {
    errors.push({ field: "FCVC", message: "FCVC is required." });
  } else if (typeof data.FCVC !== "number" || data.FCVC < 1 || data.FCVC > 3) {
    errors.push({ field: "FCVC", message: "FCVC must be a number between 1 and 3." });
  }

  // Validate NCP (Number of main meals)
  if (data.NCP === undefined || data.NCP === null || data.NCP === "") {
    errors.push({ field: "NCP", message: "NCP is required." });
  } else if (typeof data.NCP !== "number" || data.NCP < 1 || data.NCP > 4) {
    errors.push({ field: "NCP", message: "NCP must be a number between 1 and 4." });
  }

  // Validate CAEC (Consumption of food between meals)
  if (!data.CAEC) {
    errors.push({ field: "CAEC", message: "CAEC is required." });
  } else if (!CAEC.includes(data.CAEC)) {
    errors.push({ field: "CAEC", message: `Invalid CAEC value. Allowed values: ${CAEC.join(", ")}` });
  }

  // Validate SMOKE
  if (!data.SMOKE) {
    errors.push({ field: "SMOKE", message: "SMOKE is required." });
  } else if (!SMOKE.includes(data.SMOKE)) {
    errors.push({ field: "SMOKE", message: `Invalid SMOKE value. Allowed values: ${SMOKE.join(", ")}` });
  }

  // Validate CH2O (Water consumption)
  if (data.CH2O === undefined || data.CH2O === null || data.CH2O === "") {
    errors.push({ field: "CH2O", message: "CH2O is required." });
  } else if (typeof data.CH2O !== "number" || data.CH2O < 1 || data.CH2O > 3) {
    errors.push({ field: "CH2O", message: "CH2O must be a number between 1 and 3." });
  }

  // Validate SCC (Calories consumption monitoring)
  if (!data.SCC) {
    errors.push({ field: "SCC", message: "SCC is required." });
  } else if (!SCC.includes(data.SCC)) {
    errors.push({ field: "SCC", message: `Invalid SCC value. Allowed values: ${SCC.join(", ")}` });
  }

  // Validate FAF (Physical activity frequency)
  if (data.FAF === undefined || data.FAF === null || data.FAF === "") {
    errors.push({ field: "FAF", message: "FAF is required." });
  } else if (typeof data.FAF !== "number" || data.FAF < 0 || data.FAF > 3) {
    errors.push({ field: "FAF", message: "FAF must be a number between 0 and 3." });
  }

  // Validate TUE (Time using technology devices)
  if (data.TUE === undefined || data.TUE === null || data.TUE === "") {
    errors.push({ field: "TUE", message: "TUE is required." });
  } else if (typeof data.TUE !== "number" || data.TUE < 0) {
    errors.push({ field: "TUE", message: "TUE must be a positive number " });
  }

  // Validate CALC (Alcohol consumption)
  if (!data.CALC) {
    errors.push({ field: "CALC", message: "CALC is required." });
  } else if (!CALC.includes(data.CALC)) {
    errors.push({ field: "CALC", message: `Invalid CALC value. Allowed values: ${CALC.join(", ")}` });
  }

  // Validate MTRANS (Transportation used)
  if (!data.MTRANS) {
    errors.push({ field: "MTRANS", message: "MTRANS is required." });
  } else if (!MTRANS.includes(data.MTRANS)) {
    errors.push({ field: "MTRANS", message: `Invalid MTRANS value. Allowed values: ${MTRANS.join(", ")}` });
  }

  return errors;
}

module.exports = {
  validateObesityInput
};