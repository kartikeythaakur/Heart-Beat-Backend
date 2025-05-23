const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  message: {
    type: String,
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});
