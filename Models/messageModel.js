const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId : {
    type:mongoose.Schema.Types.ObjectId
  },
  recieverId:{
    type:mongoose.Schema.Types.ObjectId
  },
  message:{
    type:String
  }
},{timestamps:true});

module.exports = mongoose.model("Message",messageSchema);
