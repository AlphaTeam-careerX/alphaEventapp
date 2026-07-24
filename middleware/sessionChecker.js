const mongoose =require("mongoose")
const {orgORGmodel,indiOrgModel,allUserModel}=require("../model/organizerDB")
const sessionModel=require("../model/sessiosDB")
const activityModel = require("../model/activitySchema");
const eventModel = require("../model/eventsDB");

//TO BE IMPLEMENTED SOON
const checkSession = async (req, res, next) => {
  try {
    const rawSessToken = req.headers["authorization"];
    const decodedToken = rawSessToken ? rawSessToken.split(" ")[1] : null;

    if(req.path.startsWith("/login") ||
        req.path.startsWith("/signup") ||
        req.path.startsWith("/auth") ||
        req.path.startsWith("/buyTicket-initiate")
      ){return next()}
    //decode the token and check if it exists in the session collection

    const decoded = jwt.verify(decodedToken, process.env.refresTk);

    //is jwt expired check
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({ msg: "Session expired" });
      res.redirect(`https://myalvent.com/LogIn?msg=Session expired`);
    }

    // if (!sessToken) {
    //   return res.status(401).json({ msg: "Session token required" });
    // }

    // const session = await sessionModel.findOne({ sessToken });

    // if (!session) {
    //   return res.status(401).json({ msg: "Session expired" });
    // }

    // Optionally attach user/session info to request
    // req.session = session;
    // req.userID = session.userID || "Anonymous";

    next();
  } catch (err) {
    console.error("Session check error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};



const logActivity = async (req, res, next) => {
  try {
    console.log(" req:", req.session);
    if (req.session) {
      await activityModel.create({
        userID: req.session.userID|| "Anonymous",
        sessionID: req.session.sessionID|| "Anonymous",
        route: req.originalUrl,
        method: req.method,
        action: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    }
  } catch (err) {
    console.error("Activity logging error:", err.message);
  }
  next();
};


const eventClickGet = async (req, res, next) => {
  try {
    const { eventID } = req.params;

    if (!eventID) {
      return next(); // skip if eventID is not provided
    }

    await eventModel.updateOne(
      { eventID },
      { $inc: { clicks: 1 } }
    );

    next();
  } catch (error) {
    console.error("Error updating event clicks:", error.message);
    next(); // don't block the route if there's an error
  }
};


module.exports = {checkSession,logActivity,eventClickGet};
