const { chatRoomModel } = require("../Models/chatRoomModel");
const { chat } = require("../Models/chatModel");

//Create chat room
const createChatRoom = async (req, res) => {
  console.log("Request at Create Chat room");
  // console.log(req.user._id);
  // console.log(req.body.otheruserId);
  // return  res.status(200).json({message:`Other ID : ${req.body.otheruserId}`, userID:`UserID : ${req.user._id}`});
  try {
    const userId = req.user._id;
    const { otheruserId } = req.body;
    const isChatRoomExists = await chatRoomModel.findOne(
      {
        $or: [
          { senderId: userId, receiverId: otheruserId },
          { senderId: otheruserId, receiverId: userId },
        ],
      },
      { senderId: 0, receiverId: 0 }
    );
    if (isChatRoomExists) {
      return res.status(200).json({
        status: 200,
        message: "Room data",
        data: { roomId: isChatRoomExists?._id },
      });
    } else {
      const createRoom = await chatRoomModel.create({
        senderId: userId,
        receiverId: otheruserId,
      });
      return res
        .status(200)
        .json({ status: 200, message: "Room data", data: createRoom?._id });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
};

//Fetch Messages
const fetchMessages = async (req, res) => {
  console.log("Request at Fetch messages Api");
  const senderId = req.user._id;
  const { receiverId } = req.query;

  try {
    if (receiverId && senderId) {
      const roomDetails = await chatRoomModel.findOne({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      if (roomDetails) {
        const roomId = roomDetails?._id.toString()
        const foundMessages = await chat
          .find({
            $or: [
              { senderId: senderId, roomId: roomId },
              { senderId: receiverId, roomId: roomId},
            ],
          })
          .sort({ createdAt: 1 });
        return res.status(200).json({messages:foundMessages,message:"Messages fetched successfully.", success:true});
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Server error",error,success:false});
  }
};

module.exports = { createChatRoom, fetchMessages };
