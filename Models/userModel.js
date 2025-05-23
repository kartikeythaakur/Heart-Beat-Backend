const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpire:{
      type:Date
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    dob: {
      type: String,
    },
    bio: {
      type: String,
    },
    pronouns: {
      type: [String],
    },
    gender: {
      type: String,
    },
    sexuality: {
      type: String,
    },
    location: {
      type: String,
    },
    profilePhotos: {
      type: [String],
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    genderPreferred: {
      type: String,
    },
    matches: {
      type: [String],
    },
    chatUsers: {
      type: [String],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
