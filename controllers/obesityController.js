const Obesity = require('../models/obesityModel');
const cloudinary = require('../config/cloudinaryConfig');
const User = require('../models/userModel');
const moment = require('moment-timezone');
const obesityPatientStatus = require('../APIModelCaller/obesityApiCaller');
const { validateObesityInput } = require('../validations/validateObesityData');
const calculateAge = require('../utils/calculateAge');

const processObesityPrediction = async (req, res) => {
  try {
    const { userId } = req.currentUser;
    const patientData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    patientData.Gender = user.gender;
    patientData.Age = calculateAge(user.DateOfBirth);

    const validationErrors = validateObesityInput(patientData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validationErrors
      });
    }

    const { prediction, pdfBuffer } = await obesityPatientStatus(patientData);

    const pdfUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          format: 'pdf',
          folder: "med_VQA_Data/obesity_reports",
          public_id: `${userId}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(pdfBuffer);
    });

  
    let obesityRecord = await Obesity.findOne({ userID: userId });

    if (obesityRecord) {
      // If exists → update 
      obesityRecord.predictionResult = prediction;
      obesityRecord.reportPdfUrl = pdfUpload.secure_url;
      obesityRecord.date = new Date(); 
      await obesityRecord.save();
    } else {
      // If not exists → create new record
      obesityRecord = new Obesity({
        userID: userId,
        predictionResult: prediction,
        reportPdfUrl: pdfUpload.secure_url
      });
      await obesityRecord.save();
    }

    res.status(201).json({
      success: true,
      message: "Obesity prediction processed successfully",
      data: {
        prediction,
        pdfUrl: pdfUpload.secure_url,
        date: moment(obesityRecord.date).tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss")
      }
    });

  } catch (error) {
    console.error('Error processing obesity prediction:', error);
    res.status(500).json({
      success: false,
      message: "Failed to process obesity prediction",
      error: error.message
    });
  }
};




const getUserObesityReports = async (req, res) => {
  try {
    const { userId } = req.currentUser;

    const obesityRecord = await Obesity.findOne({ userID: userId });

    const result = obesityRecord
      ? {
          predictionResult: obesityRecord.predictionResult,
          reportPdfUrl: obesityRecord.reportPdfUrl,
          date: moment(obesityRecord.date).tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss")
        }
      : {}; 
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching obesity report:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch obesity report",
      error: error.message
    });
  }
};


module.exports = {
  processObesityPrediction,
  getUserObesityReports,
};