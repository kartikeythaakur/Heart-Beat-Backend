const express = require('express');
const router = express.Router();
const {likeUser,getLikes,unmatch,chatUsers,unmatchChat} = require('../Controllers/likeController');

//When a User Like other User
router.post("/likeAUser",likeUser);

//To get all the likes 
router.get("/likes",getLikes);

//To reject a like
router.delete('/unmatch',unmatch)

//To get Chat Users
router.get('/chatUsers',chatUsers)

router.delete('/unmatchChat',unmatchChat)

module.exports = router
