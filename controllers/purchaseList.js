const eventModel=require("../model/eventsDB")
const paymentModel=require("../model/paymeNtDb")
const moment=require("moment")


const purchaseListFXN = async (req, res) => {
  const { userID } = req.params;
  
  try {

    const checkUserEvents = await eventModel.find({userID: userID}).lean();
    // console.log("checkUserEvents:", checkUserEvents);
    if (!checkUserEvents || checkUserEvents.length === 0) {
      return res.status(404).json({ msg: "No events found for this organizer" });
    }


    const eventIDs = checkUserEvents.map(event => event.eventID);

    // console.log("Event IDs for user:", eventIDs);
    

    const eventNameMap = new Map(checkUserEvents.map(e => [e.eventID, e.eventTitle]));
    // console.log("Event Name Map:", eventNameMap);


    const allPaymentRecords = await paymentModel.find({ eventID: { $in: eventIDs } }).sort({ trnsctnDT: -1 }).lean();
    // console.log("All Payment Records:", allPaymentRecords);
    if (!allPaymentRecords || allPaymentRecords.length === 0) {
      return res.status(404).json({ msg: "No payment records found for this organizer's events" });
    }
    

    const lineItems = allPaymentRecords.map(record => ({
      user_Name: record.user_Name ? record.user_Name : "Unknown User",
      eventName: eventNameMap.get(record.eventID)? eventNameMap.get(record.eventID) : "Unknown Event",
      ticketType: record.tickets ? record.tickets.map(t => t.ticketType).join(", ") : "",
      purchaseDate: moment(record.trnsctnDT).format('MMMM D'),
      paymentStatus: record.paymentStatus
    }));


    return res.status(200).json({
       msg: "SUCCESSFUL", 
       purchaseItems: lineItems 
    });

  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
  
}


module.exports = {purchaseListFXN}