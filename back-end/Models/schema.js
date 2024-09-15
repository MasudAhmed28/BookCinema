const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  movie: { type: String },
  slot: { type: String },
  seats: { type: String },
  Date: { type: Date },
  userBooked: { type: String },
  ticketNumber: { type: String },
});

const Ticket = mongoose.model("bookmovietickets", TicketSchema);
module.exports = Ticket;
