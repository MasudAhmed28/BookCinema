const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
  seatNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "reserved", "booked"],
    default: "available",
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  reservedAt: { type: Date, default: null },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  bookedAt: { type: Date, default: null },
});

const Seat = mongoose.model("Seat", SeatSchema);
module.exports = Seat;
