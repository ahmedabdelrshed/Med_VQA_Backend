const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sharedId: {
    type: String,
    unique: true,
    sparse: true,
  },
  isShared: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Chat", chatSchema);

