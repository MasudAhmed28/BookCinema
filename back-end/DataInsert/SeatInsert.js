const Show = require("../Models/ShowSchema");
const Seat = require("../Models/SeatSchema"); // Ensure you have a Seat model defined

const generateSeats = async (showId) => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    for (let i = 1; i <= 8; i++) {
      const seatNumber = `${row}${i}`;
      const status = "available";

      seats.push({
        show: showId,
        seatNumber,
        status,
        reservedBy: null,
        reservedAt: null,
        bookedBy: null,
        bookedAt: null,
      });
    }
  });

  return seats;
};

const insertSeats = async () => {
  try {
    const shows = await Show.find();

    const showsId = shows.map((show) => show._id);

    // Collect all seat data
    const allSeats = [];
    for (const showId of showsId) {
      const seats = await generateSeats(showId);
      allSeats.push(...seats);
    }
    console.log(allSeats);

    await Seat.insertMany(allSeats);
    console.log("Seats inserted successfully!");
  } catch (error) {
    console.error("Error inserting seats:", error);
  }
};

module.exports = insertSeats;
