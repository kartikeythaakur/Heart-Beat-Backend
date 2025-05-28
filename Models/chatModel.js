const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: {
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
  },
  {
    timestamps: true,
  }
);
const chat = mongoose.model("chat", chatSchema);
module.exports = { chat };
