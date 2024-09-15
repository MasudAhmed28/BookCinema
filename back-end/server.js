const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const connectDB = require("./dbConnection");
const cors = require("cors");

const Ticket = require("./Models/schema");
const user = require("./Models/UserSchema");
const jwt = require("jsonwebtoken");
const test = require("dotenv").config();
const Show = require("./Models/ShowSchema");
const Seat = require("./Models/SeatSchema");
const Movie = require("./Models/MovieList");

const Port = process.env.PORT;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app URL
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./Routes/routes"));

io.on("connection", (socket) => {
  console.log("A new user connected");

  Seat.find().then((seats) => {
    socket.emit("seatStatuses", seats);
  });

  socket.on("selectSeat", async (data) => {
    const { seatId, selected, reservedby, showName, showTime, dateSelected } =
      data;

    try {
      const movieFind = await Movie.findOne({ title: showName });
      const showFind = await Show.findOne({
        movie: movieFind._id,
        timeSlot: showTime,
        date: dateSelected,
      });
      const seat = await Seat.findOne({
        seatNumber: seatId,
        show: showFind._id,
      });

      if (!seat) {
        console.error("Seat not found:", seatId);
        return;
      }
      const userReserved = await user.findOne({ username: reservedby });
      seat.status = selected ? "reserved" : "available";
      seat.reservedBy = selected ? userReserved?._id : null;
      seat.reservedAt = selected ? new Date() : null;
      await seat.save();

      io.emit("seatStatuses", await Seat.find({ show: seat.show }));
      if (selected) {
        setTimeout(async () => {
          const updatedSeat = await Seat.findOne({ seatNumber: seatId });
          if (
            updatedSeat.status === "reserved" &&
            new Date() - updatedSeat.reservedAt >= 5 * 60 * 1000
          ) {
            updatedSeat.status = "available";
            updatedSeat.reservedBy = null;
            updatedSeat.reservedAt = null;
            await updatedSeat.save();

            io.emit("seatStatuses", await Seat.find());
          }
          console.log("seats are resetted");
        }, 5 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error updating seat status:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(Port, () => {
  console.log("Server listening on port 8080");
});
