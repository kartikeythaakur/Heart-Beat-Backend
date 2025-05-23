const likeModel = require("../Models/likeModel");
const userModel = require("../Models/userModel");

async function likeUser(req, res) {
  console.log("Request at LikeAuser");
  const { likedBy, likedTo } = req.body;
  if (!likedBy || !likedTo)
    return res
      .status(400)
      .json({
        message: "liked by id or liked to id not provided",
        success: false,
      });

  try {
    //Check For user side
    const isAlreadyLike = await likeModel.findOne({
      likeBy: likedBy,
      likeTo: likedTo,
    });
    if (isAlreadyLike) {
      return res
        .status(400)
        .json({ message: "User liked already", success: false });
    }

    //Check that B liked A already or not
    const isUserLike = await likeModel.findOne({
      likeBy: likedTo,
      likeTo: likedBy,
    });

    //Set UserB status to 2
    if (isUserLike) {
      isUserLike.status = 2;
      await isUserLike.save();
    }

    //Set the UserA Status to 2
    if (isUserLike) {
      const userA = new likeModel({
        likeBy: likedBy,
        likeTo: likedTo,
        status: 2,
      });
      await userA.save();
      return res
        .status(200)
        .json({ matchMessage: "Matched successfully", success: true });
    } else {
      const userA = new likeModel({
        likeBy: likedBy,
        likeTo: likedTo,
        status: 1,
      });
      await userA.save();
      return res
        .status(200)
        .json({ message: "User liked Successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in like a User", success: false, error });
  }
}

async function getLikes(req, res) {
  console.log("Request at Like GetLikes");
  const { _id } = req.query;
  console.log(_id);
  try {
    const liked = await likeModel.find({likeTo:_id, status: 1}).populate("likeBy");
    console.log("Get Liked:",liked);
    return res.status(200).json({message:"Likes fetched successfully",liked,success:true});
  } catch (error) {
    console.log("Like Error",error);
    return res.status(500).json({message:"Error in get likes",success:false,error});
  }
}

async function unmatch(req,res){
  console.log("Request at unmatch");
  const {_id}= req.query;
  console.log(_id);
  
  if(!_id) return res.status(400).json({message:"Id not provided at unmatch", success: false});

  try {
    const response = await likeModel.findByIdAndDelete({_id});
    console.log("Unmatch Response",response);
    return res.status(200).json({message:"Unmatched successfully",success:true});
  } catch (error) {
    console.log(error)
    return res.status(400).json({message:"Error at unmatch", success: false,error});
  }
}

async function chatUsers(req,res){
  const{likedTo} = req.query;
  if(!likedTo) return res.status(400).json({message:"LikedTo not provided",success: false});
  try {
    const chatUsers = await likeModel.find({likeTo:likedTo , status:2}).populate("likeBy");
    return res.status(200).json({message:"Chat users fetched successfully", success:true,chatUsers});
  } catch (error) {
    console.log(error);
   return res.status(400).json({message:"Error at chatUsers",success: false,error});
  }
}

async function unmatchChat(req,res){
  const{likedBy , likedTo} = req.query;
  console.log(likedBy,likedTo);
  if(!likedBy || !likedTo) return res.status(400).json({message:"Likedby or likedTo id not provided",success:false});

  try {
     const resp1 = await likeModel.deleteOne({likeBy:likedBy,likeTo:likedTo});
     const resp2 =  await likeModel.deleteOne({likeBy:likedTo,likeTo:likedBy});
     return res.status(200).json({message:"Unmatched successfully",success:true});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:"Server error at unmatchChat",success:false,error});
  }
}

module.exports = { likeUser, getLikes , unmatch , chatUsers,unmatchChat };
