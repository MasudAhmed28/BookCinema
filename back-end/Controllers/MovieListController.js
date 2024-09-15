const movie = require("../Models/MovieList");
const Seat = require("../Models/SeatSchema");
const Show = require("../Models/ShowSchema");

const createNewMovie = async (req, res) => {
  try {
  } catch (error) {}
};
const getMoviesList = async (req, res) => {
  try {
    const mydata = await movie.find();
    if (mydata.length === 0) {
      res.status(200).json({ data: null, message: "No movies found!" });
    } else {
      res.status(200).json({ data: mydata });
    }
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
};

const getAvailableSeats = async (req, res) => {
  const { fmovie, fslot, fdate } = req.query;

  try {
    const findmovie = await movie.findOne({ title: fmovie });

    if (!findmovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const show = await Show.findOne({
      movie: findmovie._id,
      timeSlot: fslot,
      date: fdate,
    });

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    const seats = await Seat.find({ show: show._id });

    res.json(seats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching seats" });
  }
};

const createShowSeat = async (req, res) => {
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

  try {
    const { date, timeSlots, movieId } = req.body;

    // Create shows
    const shows = timeSlots.map((timeSlot) => ({
      movie: movieId,
      timeSlot,
      date,
      totalSeats: 48, // 6 rows x 8 seats per row
      availableSeats: 48,
      bookedSeats: 0,
    }));
    const createdShows = await Show.insertMany(shows);

    // Create seats for each show
    const allSeats = [];
    for (const show of createdShows) {
      const seats = generateSeats(show._id);
      allSeats.push(...seats);
    }
    await Seat.insertMany(allSeats);

    res.json({ success: true });
  } catch (error) {
    console.error("Error creating shows and seats:", error);
    res.json({ success: false, message: "Error creating shows and seats." });
  }
};

module.exports = {
  createNewMovie,
  getMoviesList,
  getAvailableSeats,
  createShowSeat,
};
