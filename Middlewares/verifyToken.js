const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const headers = req?.headers["authorization"];
  const token = headers?.split(" ")[1];
  // console.log("Token from Frontend:", token);
  if (!headers) {
    return res
      .status(400)
      .json({ message: "Headers not Provided", success: false });
  } else if (!token) {
    return res
      .status(400)
      .json({ message: "Token not Provided", success: false });
  }

  try {
     const tokenVerified = jwt.verify(token,process.env.SECRET_KEY);
     req.user = tokenVerified;
     console.log("Token is Verified");
     next();
  } catch (error) {
    return res
    .status(400)
    .json({ message: "Invalid Token", success: false ,error});
  }
};

module.exports = verifyToken

