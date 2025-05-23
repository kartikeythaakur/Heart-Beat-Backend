const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { ConnectToDB } = require("./config/connection");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const userRoute = require("./Routes/userRoute");
const otpRoute = require("./Routes/otpRoute");
const likeRoute = require("./Routes/likeRoute");

ConnectToDB(process.env.URI);

//MiddleWare for Parsing Json objects from frontend
app.use(express.json());

// MiddleWare for Cross Origins
app.use(cors({ origin: "http://localhost:3000" }));

//Middle to serve files on frontend
app.use("/uploads", express.static("uploads"));

//User Routes
app.use("/api/user", userRoute);
//OTP verification
app.use("/api/", otpRoute);

//Like Routes
app.use("/api/like", likeRoute);

//Socket Implementation
io.on("connection", (socket) => {
  console.log("New user Connected:", socket.id);

  // Join a room using sender and receiver IDs
  socket.on("join-room", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("_");
    socket.join(roomId);
    console.log(`User ${senderId} joined room ${roomId}`);
  });

  // Send private message to the room
  // socket.on("private-message", ({ senderId, receiverId, message }) => {
  //   const roomId = [senderId, receiverId].sort().join("_");
  //   io.to(roomId).emit("receive-message", { message, senderId });
  //   console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

//App is Running on this PORT
server.listen(process.env.PORT, () => {
  console.log(`HeartBeat is Running on ${process.env.PORT}`);
});
