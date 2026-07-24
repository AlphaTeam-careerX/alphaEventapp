const mongoose =require("mongoose")
const jwt=require("jsonwebtoken")
const {allUserModel,indiOrgModel} = require('../model/organizerDB')

// AUTH
exports.authFxn = async (req, res, next) => {
  try {
    const tk = req.headers.authorization;
    // console.log("TOKEN:", tk)

    if (!tk) {
      return res.status(401).json({ message: "Access Denied!" });
    }

    const token = tk.split(" ")[1];
    let decoded;
    try {
    decoded = jwt.verify(token, process.env.refresTk);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
      
      // console.log(decoded.email)

    if(req.path.startsWith("/login") ||
        req.path.startsWith("/signup") ||
        req.path.startsWith("/auth") ||
        req.path.startsWith("/buyTicket-initiate")
      ){return next()}

    if (!decoded) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const userMail = decoded.email;
    console.log("Decoded Email:", userMail);
    const user = await allUserModel.findOne({ email: userMail });

    if (!user) {
      return res.status(404).json({ message: "User account not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
