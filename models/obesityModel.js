const mongoose = require('mongoose');

const obesitySchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  predictionResult: {
    type: String, 
    required: true,
  },
  reportPdfUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Obesity = mongoose.model('Obesity', obesitySchema);

module.exports = Obesity;
