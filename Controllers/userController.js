const userModel = require("../Models/userModel");
const sendOtp = require("../utils/sendOtp");

async function signUpController(req, res) {
  console.log("SignUp request recieved");
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ messgae: "Email not Provided", success: false });
    }

    //Check if the email exists
    const isUser = await userModel.findOne({ email });
    if (isUser)
      return res
        .status(400)
        .json({ message: "Email already exists, Try Login", success: false });

    //Generate an OTP
    let otp = Math.floor(100000 + Math.random() * 900000);
    otp = String(otp);
    let otpExpire=new Date().getTime() + 10 * 60 * 1000
    //Send OTP
    const isSent = await sendOtp(email, otp);

    //If OTP sent Create New User in Database
    if (isSent) {
      const newUser = new userModel({
        email: email,
        otp: otp,
        otpExpire
      });

      const updatedUser = await newUser.save();
      console.log(updatedUser);

      return res.status(201).json({
        message: "Verify your email",
        success: true,
        email: updatedUser?.email,
      });

    } else {
      return res
        .status(500)
        .json({ message: "Failed to send OTP,Try Again", success: false });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error(Failed to Register)",
      success: false,
      error: { ...error },
    });
  }
}

async function basicInfoController(req, res) {
  const {
    email,
    name,
    dob,
    pronouns,
    gender,
    sexuality,
    location,
    genderPreferred,
    bio,
  } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email not provided", success: false });
  }

  try {
    const user = await userModel.findOne({ email });
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name,
          dob,
          pronouns,
          gender,
          sexuality,
          location,
          genderPreferred,
          bio,
        },
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Basic Details updated Sucessfully",
      email: updatedUser.email,
      updatedDetails: {
        name: updatedUser.name,
        dob: updatedUser.dob,
        pronouns: updatedUser.pronouns,
        gender: updatedUser.gender,
        sexuality: updatedUser.sexuality,
        genderPreferred: updatedUser.genderPreferred,
        isProfileCompleted: updatedUser.isProfileCompleted,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ messgae: "Server Error Basic Info", success: false, error });
  }
}

async function uploadProfilePhotos(req, res) {
  console.log("Upload Photos API called");
  const { email } = req.body;
  // console.log(req.files)
  if (!email) {
    return res
      .status(400)
      .json({ message: "No email Provided", success: false });
  }

  //Create the array of path we'll store in database
  const photosUploaded = req?.files?.map((ele) => {
    return `uploads/${ele.filename}`;
  });

  console.log(photosUploaded);

  try {
    const user = await userModel.findOne({ email });
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { $set: { profilePhotos: photosUploaded, isProfileCompleted: true } },
      { new: true }
    );
    return res.status(200).json({
      message: "Profile Photos Uploaded",
      success: true,
      photosUploaded: updatedUser.profilePhotos,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while saving photos", success: false, error });
  }
}

async function getUserProfile(req, res) {
  const { email } = req.user;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email not provided", success: false });
  }
  try {
    const user = await userModel.findOne({ email });
    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error Get Profile", success: false, error });
  }
}

async function loginController(req, res) {
  console.log("Request at Login");
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "Email not provided", success: false });

    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Email doesn't exist", success: false });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify your email first" });
    }

    //Generate an OTP
    let otp = Math.floor(100000 + Math.random() * 900000);
    otp = String(otp);

    //Send OTP
    const isSent = await sendOtp(email, otp);
    console.log(isSent);
    const response = await userModel.findByIdAndUpdate(
      user._id,
      { $set: { otp: otp } },
      { new: true }
    );
    console.log(response);
    return res
      .status(200)
      .json({ message: "Email verified , OTP sent", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error Login", error });
  }
}

async function getSwipeProfiles(req, res) {
  console.log("Request at Swipe Profiles");
  const { email } = req.user;
  if (!email) res.status(400).json({ message: "No email Provided Swipe" });
  try {
    const response = await userModel.find({});
    const swipeUsers = response.filter((user) => user.email != email);
    return res
      .status(200)
      .json({
        message: "Swiped profiles fetched successfully",
        swipeUsers,
        success: true,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error Swiped profiles", success: false, error });
  }
}

async function swiped(req, res) {
  const { _id, likedById } = req.body;
  if (!_id || !likedById)
    return res
      .status(400)
      .json({ message: "No user id or likedId provided", success: false });
  //Add the id of user who liked
  try {
    const user = await userModel.findByIdAndUpdate(
      _id,
      { $addToSet: { matches: likedById } },
      { new: true }
    );
    // console.log("Upated liked user :", user);
    res
      .status(200)
      .json({ message: `${user.name} liked successFully`, success: true });
  } catch (error) {
    if (!_id)
      return res
        .status(400)
        .json({ message: "Error at swiped", success: false, error });
  }
}

async function fetchMatches(req, res) {
  console.log("request at fetch matches");
  const { email } = req.user;
  if (!email)
    return res
      .status(500)
      .json({ message: "Server Error at Matches", success: false });
  try {
    const user = await userModel.findOne({ email });
    const matches = await userModel.find({ _id: { $in: user.matches } });
    res.status(200).json({
      message: "Matches fetched successfully",
      matches,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error at Matches", success: false, error });
  }
}

async function acceptMatch(req, res) {
  console.log("Request at Accept Match");
  const { _id } = req.user;
  const { matchedId } = req.body;

  if (!_id || !matchedId)
    return res
      .status(400)
      .json({ message: "No user id or matched id provided", success: false });
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      { $addToSet: { chatUsers: matchedId } },
      { new: true }
    );
    await userModel.findByIdAndUpdate(
      _id,
      { $pull: { matches: matchedId } },
      { new: true }
    );
    // console.log("Updated Chat user :", updatedUser.chatUsers);
    return res
      .status(200)
      .json({ message: "Match accepted successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while matching", success: false, error });
  }
}

async function rejectMatch(req, res) {
  console.log("Request at Reject Match");
  const { _id } = req.user;
  const { rejectedId } = req.body;

  if (!_id || !rejectedId)
    return res
      .status(400)
      .json({ message: "No user id or reject id provided", success: false });
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      { $pull: { matches: rejectedId } },
      { new: true }
    );
    // console.log("Updated Reject Users", updatedUser.matches);
    res
      .status(200)
      .json({ message: "Match rejected successfully", success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Server error while Rejecting", success: false, error });
  }
}

async function chatUsers(req, res) {
  console.log("Request at Chat Users");
  const { _id } = req.user;
  if (!_id)
    return res
      .status(400)
      .json({ message: "No chat id Provided", success: false });

  try {
    const mongoUser = await userModel.findById({ _id });
    const availableToChat = mongoUser?.chatUsers;
    const chatUsers = await userModel.find({_id: {$in :availableToChat}});
    return res
      .status(200)
      .json({
        message: "Chat users fetched successfully",
        chatUsers,
        success: true,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error at Chat Users", success: false, error });
  }
}

module.exports = {
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
};
