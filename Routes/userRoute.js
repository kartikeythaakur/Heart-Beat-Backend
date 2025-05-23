const express = require("express");
const router = express.Router();
const verifyToken = require("../Middlewares/verifyToken");
const upload = require("../utils/uploadPhotos");
const {
  signUpController,
  basicInfoController,
  uploadProfilePhotos,
  getUserProfile,
  loginController,
  getSwipeProfiles,
  swiped,
  fetchMatches,
  acceptMatch,
  rejectMatch,
  chatUsers,
} = require("../Controllers/userController");
const { verify } = require("jsonwebtoken");

//Sign Up
router.post("/signup", signUpController);

//Login
router.post("/login", loginController);

//Basic Info
router.put("/editProfileInfo", verifyToken, basicInfoController);

//Upload all Photos
router.put(
  "/uploadPhotos",
  verifyToken,
  upload.array("profilePhotos", 4),
  uploadProfilePhotos
);

//Get User Profile
router.get("/profile", verifyToken, getUserProfile);

//Get swipe Porfiles
router.get("/swipe-profiles", verifyToken, getSwipeProfiles);

//Swipe profile API
router.post("/swiped", verifyToken, swiped);

//Fetch Mathces API
router.get("/matches", verifyToken, fetchMatches);

//Accpet Match API
router.put('/accept-match',verifyToken,acceptMatch);

//Reject Match API
router.put('/reject-match',verifyToken,rejectMatch)

//Get Chat Users
router.get('/chatUsers',verifyToken,chatUsers);

module.exports = router;
