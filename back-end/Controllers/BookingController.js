const Ticket = require("../Models/schema");
const movie = require("../Models/MovieList");
const Show = require("../Models/ShowSchema");
const Seat = require("../Models/SeatSchema");
const user = require("../Models/UserSchema");
const bookMovie = async (req, res) => {
  const { movieSelected, slot, seats, userBooked, selectedseat, selecteddate } =
    req.body;
  console.log(req.body);

  try {
    // Check if the parsed result is indeed an array
    if (!Array.isArray(selectedseat)) {
      throw new Error("selectedseat should be an array after parsing");
    }

    const generateTicketNumber = (seatName) => {
      const prefix = "Ticket";
      const moviename = movieSelected;
      const timestamp = Date.now();
      const randomPart = seatName;
      return `${prefix}-${moviename}-${timestamp}-${randomPart}`;
    };

    const allTickets = [];

    const movieFind = await movie.findOne({ title: movieSelected });
    const userReserved = await user.findOne({ username: userBooked });

    const showFind = await Show.findOne({
      movie: movieFind._id,
      timeSlot: slot,
      date: selecteddate,
    });

    for (const seatName of selectedseat) {
      const seatToUpdate = await Seat.findOne({
        show: showFind._id,
        seatNumber: seatName,
      });

      // Check if the seat is already reserved by another user
      if (
        seatToUpdate.status === "reserved" &&
        seatToUpdate.reservedBy.toString() !== userReserved._id.toString()
      ) {
        return res.status(400).json({
          data: null,
          message: `Seat ${seatName} is already reserved by another user.`,
        });
      }

      seatToUpdate.status = "booked";
      seatToUpdate.bookedBy = userReserved._id;
      seatToUpdate.bookedAt = new Date();
      await seatToUpdate.save();

      const ticket = {
        movie: movieSelected,
        slot: slot,
        seats: seatName,
        Date: selecteddate,
        userBooked: userBooked,
        ticketNumber: generateTicketNumber(seatName),
      };
      allTickets.push(ticket);
    }

    const savedTickets = await Ticket.insertMany(allTickets);

    console.log("seats booked");
    res
      .status(200)
      .json({ data: savedTickets, message: "Booking successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
};

const getLastBooking = async (req, res) => {
  try {
    const myData = await Ticket.find({ userBooked: req.user.username })
      .sort({ _id: -1 })
      .limit(1);

    if (myData.length === 0) {
      res
        .status(200)
        .json({ data: null, message: "No previous booking found!" });
    } else {
      const imageData = await movie.findOne({ title: myData[0].movie });
      myData[0] = {
        ...myData[0]._doc, // Spread the original data (._doc is used to access the plain object data in Mongoose)
        imageData, // Add the imageUrl property
      };
      res.status(200).json({ data: myData[0] });
    }
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
};

module.exports = { bookMovie, getLastBooking };
