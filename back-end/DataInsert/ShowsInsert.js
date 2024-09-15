const movie = require("../Models/MovieList");
const Show = require("../Models/ShowSchema");
const Seat = require("../Models/SeatSchema");
const generateSeats = (showId) => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F"]; // 6 rows
  rows.forEach((row) => {
    for (let i = 1; i <= 8; i++) {
      // 8 seats per row
      const seatNumber = `${row}${i}`;
      seats.push({
        show: showId,
        seatNumber,
        status: "available",
        reservedBy: null,
        reservedAt: null,
        bookedBy: null,
        bookedAt: null,
      });
    }
  });
  return seats;
};

const createShowsAndSeatsForNext5Months = async () => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(today.getMonth() + 5); // 5 months later

  const movies = await movie.find();
  const timeSlots = ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"]; // Time slots

  try {
    for (let date = today; date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      for (const movie of movies) {
        for (const timeSlot of timeSlots) {
          const show = new Show({
            movie,
            timeSlot,
            date: formattedDate,
            totalSeats: 48, // 6 rows x 8 seats per row
            availableSeats: 48,
            bookedSeats: 0,
          });

          const createdShow = await show.save(); // Save the show

          // Create seats for the show
          const seats = generateSeats(createdShow._id);
          await Seat.insertMany(seats);

          console.log(
            `Created show and seats for movie: ${movie}, time slot: ${timeSlot}, date: ${formattedDate}`
          );
        }
      }
    }

    console.log("All shows and seats created for the next 5 months.");
  } catch (error) {
    console.error("Error creating shows and seats:", error);
  }
};

module.exports = createShowsAndSeatsForNext5Months;
