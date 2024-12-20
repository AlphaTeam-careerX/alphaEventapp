
const {orgORGmodel,indiOrgModel,allUserModel}=require("../model/organizerDB")
const jwt=require("jsonwebtoken")
const sessionModel=require("../model/sessiosDB")

const confirmTokenFXN=async(req,res)=>{
    try{
      const{userToken}=req.body;
      const {userID}=req.params;
      const verifyID= await allUserModel.findOne({userID});
      if(!userToken){
        res.status(403).json({msg:"OTP REQUIRED"})
      };
      const veriToken= await verifyID.verifyOTpw;
      if(userToken===veriToken){
        await allUserModel.findOneAndUpdate({userID},{isEmailVerified:true});
        const sessionTokz=await jwt.sign({userID},`${process.env.accessTk}`,{expiresIn:"60m"})
        //GENERATE SESSION ID
        let sessionID
        let isUnique= false
        while(!isUnique){
        sessionID= Math.floor(Math.random()*88888)
        const findSess= await sessionModel.findOne({sessionID})
        if(!findSess)isUnique=true
        }
        //SESSION DB UPDATE
        const findUserid= await allUserModel.findOne({userID})
        const refrshTokz=await jwt.sign({userID},`${process.env.refresTk}`,{expiresIn:"1m"})
        await sessionModel.create({
            sessionID:sessionID,
            userID:findUserid,
            sessToken:sessionTokz,
            refrshTkn:refrshTokz
        })
        res.status(200).json({
        msg:"SUCCESSFUL",
        token:sessionTokz
      })
      }else{res.status(400).json({msg:"INVALID ACTION"})};
      
    }catch(error){return res.status(400).json({msg:error.message})}
  }
  module.exports=confirmTokenFXN
  