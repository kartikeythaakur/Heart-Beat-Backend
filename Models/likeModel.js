const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    likeBy : {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      likeTo : {
          type:mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        },
     status:{
      type: Number,
      default: 0
     }
   
  },
  { timestamps: true }
);

const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;
