const mongoose = require('mongoose');
const chatRoomSchema = new mongoose.Schema(
  {
    senderId :{
      type:mongoose.Schema.Types.ObjectId,
      default:null
    },
    receiverId:{
      type:mongoose.Schema.Types.ObjectId,
      default:null
    }
  },{
    timestamps: true
  }
)

const chatRoomModel = mongoose.model("chatRoom",chatRoomSchema);
module.exports = {chatRoomModel};