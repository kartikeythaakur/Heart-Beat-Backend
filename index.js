const express = require("express");
const app = express();
const cors = require("cors");
const { ConnectToDB } = require("./config/connection");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userRoute = require("./Routes/userRoute");
const otpRoute = require("./Routes/otpRoute");
const likeRoute = require("./Routes/likeRoute");
const chatRoute = require("./Routes/chatRoute");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userModel = require("./Models/userModel");
const { chatRoomModel } = require("./Models/chatRoomModel");
const { chat } = require("./Models/chatModel");

ConnectToDB(process.env.URI);

//MiddleWare for Parsing Json objects from frontend
app.use(express.json());

// MiddleWare for Cross Origins
app.use(cors({ origin: "*" }));

//Middle to serve files on frontend
app.use("/uploads", express.static("uploads"));

//User Routes
app.use("/api/user", userRoute);
//OTP verification
app.use("/api/", otpRoute);

//Like Routes
app.use("/api/like", likeRoute);

//Chat Routes
app.use("/api/chat", chatRoute);

//Socket Implementation
io.on("connection", async (socket) => {
  console.log("New user Connected:", socket.id);

  let userData;
  const tokenData = socket?.handshake?.auth?.token;

  if (tokenData) {
    const token = tokenData?.split(" ")[1];
    const tokenVerified = jwt.verify(token, process.env.SECRET_KEY);
    if (tokenVerified) {
      userData = await userModel.findById(tokenVerified?._id);
      userData.socketId = socket.id;
      await userData.save();
    }
    console.log("Token is verified at socket");
  }

  // Send private message to the room
  socket.on("private-message", async (data) => {
    console.log("data is :", data);

    const { senderId, roomId, message } = data;
    const roomDetails = await chatRoomModel.findById(roomId);
    const newChat = await chat.create(data);
    const receiverId =
      roomDetails?.senderId.toString() === senderId.toString()
        ? roomDetails?.receiverId
        : roomDetails?.senderId;
    const receiverData = await userModel.findById(receiverId);
    const senderData = await userModel.findById(senderId);
    io.to(receiverData?.socketId).emit("receive_message", newChat);
    io.to(senderData?.socketId).emit("receive_message", newChat);
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
  });

  socket.on("disconnect", async () => {
    if (userData) {
      userData.socketId = null;
      await userData.save();
    }
    console.log("User disconnected:", socket.id);
  });
});

//App is Running on this PORT
server.listen(process.env.PORT, async () => {
  console.log(`HeartBeat is Running on ${process.env.PORT}`);
});
