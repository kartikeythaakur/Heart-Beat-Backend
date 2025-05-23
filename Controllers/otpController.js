const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

async function verifyOtp(req, res) {
  console.log("Request Received at Verify OTP");
  const { otp, email } = req.body;
  if (!otp || !email)
    return res
      .status(400)
      .json({ message: "Provide all fields.", success: false });

  try {
    console.log(email);
    const user = await userModel.findOne({ email });
    const currentTime = new Date().getTime();
    
    if (user.otpExpire < currentTime) {
      return res.status(400).json({ message: "OTP expired", success: false });
    }
    if (user) {
      if (user.otp === otp) {
        const updatedUser = await userModel.findByIdAndUpdate(
          user._id,
          { $set: { isVerified: true } },
          { new: true }
        );

        await userModel.findByIdAndUpdate(user._id, {
          $unset: { otp: "", otpExpire: "" },
        });

        //Generate a Token
        const token = await jwt.sign(
          {
            isVerified: updatedUser.isVerified,
            email: updatedUser.email,
            _id: updatedUser._id,
          },
          process.env.SECRET_KEY,
          { expiresIn: "24h" }
        );

        return res.status(200).json({
          message: "Email Verified Successfully",
          success: true,
          email: updatedUser.email,
          isVerified: updatedUser.isVerified,
          isProfileCompleted: updatedUser.isProfileCompleted,
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Wrong OTP entered", success: false });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Email not Found", success: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error Verify OTP", success: false, error });
  }
}

module.exports = { verifyOtp };
