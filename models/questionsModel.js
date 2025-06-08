const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  symptoms: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  answer: {
    type: String,
    default: null,
  },
  responseVoiceUrl: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ["Symptoms", "Image"],
    default: "Image",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
