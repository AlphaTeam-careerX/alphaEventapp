// const User = require('../model/organizerDB');
const {orgORGmodel,indiOrgModel,allUserModel}=require("../model/organizerDB")
const mongoose =require("mongoose")




const getGreeting = (name) => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Good Morning, ${name}`;
  }

  if (hour < 17) {
    return `Good Afternoon, ${name}`;
  }

  return `Good Evening, ${name}`;
};

//Generate Greeting Automatically
exports.getDashboardFXN = async (req, res) => {
  try {
    const {userID}  = req.params;
    // console.log("USER ID:", userID)
    const user = await allUserModel.findOne({userID:userID});
    //   .select("name username profilePic");
    // console.log("USER DATA:", user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const displayName = user?user.username || "Kindly Update Username in Profile Settings":"User"
    res.status(200).json({
      success: true,
      data: {
        greeting: getGreeting(user.name),
        name: user.name,
        username: displayName,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
