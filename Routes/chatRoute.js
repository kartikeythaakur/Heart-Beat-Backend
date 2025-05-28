const express = require('express');
const verifyToken = require('../Middlewares/verifyToken');
const { createChatRoom , fetchMessages} = require('../Controllers/chatController');
const router = express.Router();

//Create chat room
router.post('/createChatRoom',verifyToken,createChatRoom);

//Fetch the user messages
router.get('/fetchMessages',verifyToken,fetchMessages)

module.exports = router;