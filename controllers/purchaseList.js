const eventModel=require("../model/eventsDB")
const paymentModel=require("../model/paymeNtDb")
const moment=require("moment")


const purchaseListFXN = async (req, res) => {
  const { userID } = req.params;
  
  try {
    // 1. Fetch events organized by this user
    const checkUserEvents = await eventModel.find({ userID });
    // console.log("checkUserEvents:", checkUserEvents);
    if (!checkUserEvents || checkUserEvents.length === 0) {
      return res.status(404).json({ msg: "No events found for this organizer" });
    }

    // 2. Safely declare variables and map them
    const eventIDs = checkUserEvents.map(event => event.eventID);
    
    // Create a key-value lookup map for O(1) event name lookups
    const eventNameMap = new Map(checkUserEvents.map(e => [e.eventID, e.eventTitle]));
    // console.log("Event Name Map:", eventNameMap);

    // 3. Fetch all payment records matching the event IDs
    const allPaymentRecords = await paymentModel.find({ eventID: { $in: eventIDs } });

    

    // 4. Map payment records to the final line items output
    const lineItems = allPaymentRecords.map(record => ({
      user_Name: record.user_Name ? record.user_Name : "Unknown User",
      eventName: eventNameMap.get(record.eventID)? eventNameMap.get(record.eventID) : "Unknown Event",
      ticketType: record.tickets ? record.tickets.map(t => t.ticketType).join(", ") : "",
      purchaseDate: moment(record.trnsctnDT).format('MMMM D'),
      paymentStatus: record.paymentStatus,
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