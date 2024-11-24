const mongoose =require("mongoose")

const eventSchema = new mongoose.Schema({
    eventID:{type:String,required:true},
    eventTitle:{type:String,required:true,maxlenght:20},
    eventImgURL:{type:String},
    eventDesc:{type:String},
    eventDate:{
        eventStart:{type:Date,required:true,default:Date.now},
        eventEnd:{type:Date,required:true,default:Date.now}
    },
    eventType:{type:String,required:true,enum:["physical","online"]},
    eventLocation:{
        eventVenue:{type:String,required:true},
        eventCity:{type:String,required:true},
        eventCountry:{type:String,required:true},
        },
    orgID:{type:mongoose.Schema.Types.ObjectId,ref:"orgORGmodel"},
    userID:{type:mongoose.Schema.Types.ObjectId,ref:"allUserModel"},
    ticketPrice:{type:Number,default:0},
    tickeType:{type:String,required:true,enum:["general","vip"]},
    eventCapacity:{type:Number,default:0},
    eventTicketSold:{type:Number,default:0},
    //publishEvnt:{type:String,require:true,enum:["yes","no"]}

})

const eventModel= new mongoose.model("eventModel",eventSchema)

module.exports=eventModel