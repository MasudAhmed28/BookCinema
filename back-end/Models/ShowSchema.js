const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  timeSlot: { type: String, required: true },
  date: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true, default: 0 },
  bookedSeats: { type: Number, required: true, default: 0 },
});

const Show = mongoose.model("Show", ShowSchema);
module.exports = Show;
