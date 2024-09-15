import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../Css/Seat.css";
import BsContext from "../Context/BsContext";

const socket = io("https://bookcinema-backend.onrender.com");

const Seat = () => {
  const {
    movie,
    time,
    dateSelected,
    selectedSeats,
    setSelectedSeats,
    setErrorPopup,
    setErrorMessage,
  } = useContext(BsContext);
  const [seats, setSeats] = useState([]);
  const [noSeatsFound, setNoSeatsFound] = useState(false);
  const [seatCount, setSeatCount] = useState("");

  useEffect(() => {
    if (!movie || !time) {
      return;
    }

    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `https://bookcinema-backend.onrender.com/api/seats?fmovie=${encodeURIComponent(
            movie
          )}&fslot=${encodeURIComponent(time)}&fdate=${encodeURIComponent(
            dateSelected
          )}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length === 0) {
          setNoSeatsFound(true);
          setSeats([]);
        } else if (Array.isArray(data)) {
          setSeats(data);
          setNoSeatsFound(false);
        } else {
          setNoSeatsFound(true);
          setSeats([]);
        }

        const movieSeatData =
          JSON.parse(window.localStorage.getItem("movieSeatData")) || {};
        const savedSeats = movieSeatData[movie]?.[time] || [];
        setSelectedSeats(savedSeats);
      } catch (error) {
        console.error("Error fetching seats:", error);
        setNoSeatsFound(true);
        setSeats([]);
      }
    };

    fetchSeats();

    socket.on("seatStatuses", (updatedSeats) => {
      if (Array.isArray(updatedSeats)) {
        setSeats(updatedSeats);
        setNoSeatsFound(false);
      }
    });
    return () => {
      socket.off("seatStatuses");
    };
  }, [movie, time, dateSelected, setSelectedSeats]);

  // Check for expired reservations every minute
  useEffect(() => {
    const resetExpiredReservations = () => {
      const currentTime = new Date().getTime();
      const movieSeatData =
        JSON.parse(window.localStorage.getItem("movieSeatData")) || {};

      if (!movieSeatData[movie]) {
        movieSeatData[movie] = {};
      }

      const reservedSeats = movieSeatData[movie][time] || [];
      const newReservedSeats = reservedSeats.filter((seat) => {
        const seatData = seats.find((s) => s.seatNumber === seat);
        return (
          seatData &&
          seatData.status === "reserved" &&
          new Date(seatData.reservedAt).getTime() >= currentTime - 5 * 60 * 1000
        );
      });

      movieSeatData[movie][time] = newReservedSeats;
      window.localStorage.setItem(
        "movieSeatData",
        JSON.stringify(movieSeatData)
      );

      setSelectedSeats(newReservedSeats);
      console.log("seats deleted");
    };
    const interval = setInterval(resetExpiredReservations, 60 * 1000);
    return () => clearInterval(interval);
  }, [seats, movie, time, setSelectedSeats]);

  const handleSeatClick = (seatId) => {
    const Loggeduser = window.localStorage.getItem("loggedinUser");
    if (Loggeduser) {
      if (!Array.isArray(seats)) return;

      const seat = seats.find((seat) => seat.seatNumber === seatId);
      if (!seat) return;

      // Prevent interaction with booked seats
      if (seat.status === "booked") {
        setErrorMessage(
          "This seat has already been booked and cannot be selected."
        );
        setErrorPopup(true);
        return;
      }
      if (
        seat.status === "reserved" &&
        seat.reservedBy !== window.localStorage.getItem("userId")
      ) {
        return;
      }

      let newStatus;
      const showName = movie;
      const showTime = time;
      const reservedby = window.localStorage.getItem("loggedinUser");

      if (seat.status === "available") {
        newStatus = "reserved";
        socket.emit("selectSeat", {
          seatId,
          selected: true,
          reservedby,
          showName,
          showTime,
          dateSelected,
        });
      } else if (seat.status === "reserved") {
        newStatus = "available";
        socket.emit("selectSeat", {
          seatId,
          selected: false,
          reservedby: null,
          showName,
          showTime,
          dateSelected,
        });
      }

      setSeats((prevSeats) =>
        prevSeats.map((s) =>
          s.seatNumber === seatId
            ? {
                ...s,
                status: newStatus,
                reservedAt:
                  newStatus === "reserved" ? new Date().toISOString() : null,
              }
            : s
        )
      );

      const updatedSelectedSeats =
        newStatus === "reserved"
          ? [...selectedSeats, seatId]
          : selectedSeats.filter((id) => id !== seatId);

      setSelectedSeats(updatedSelectedSeats);

      let movieSeatData =
        JSON.parse(window.localStorage.getItem("movieSeatData")) || {};
      if (!movieSeatData[movie]) {
        movieSeatData[movie] = {};
      }
      movieSeatData[movie][time] = updatedSelectedSeats;
      setSeatCount(updatedSelectedSeats.length);
      window.localStorage.setItem(
        "movieSeatData",
        JSON.stringify(movieSeatData)
      );
    } else {
      setErrorPopup(true);
      setErrorMessage("Please Login or signup to reserve a seat!");
    }
  };

  const getSeatLabel = (rowIndex, seatIndex) => {
    const rowLabels = ["A", "B", "C", "D", "E", "F"];
    return `${rowLabels[rowIndex]}${seatIndex + 1}`;
  };

  return (
    <div>
      {/* <Modal /> */}
      {movie && time ? (
        noSeatsFound ? (
          <p>No shows found for selected movie and time</p>
        ) : (
          <>
            <ul className="showcase">
              <li>
                <div className="seat available"></div>
                <small>Available</small>
              </li>
              <li>
                <div className="seat reserved"></div>
                <small>Reserved</small>
              </li>
              <li>
                <div className="seat booked"></div>
                <small>Booked</small>
              </li>
            </ul>
            <div className="newitem">
              <div className="seat reserved-by-other"></div>
              <small>Reserved by other</small>
            </div>

            <div className="container">
              <div className="screen"></div>

              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div className="row" key={rowIndex}>
                  {Array.from({ length: 8 }).map((_, seatIndex) => {
                    const seatId = getSeatLabel(rowIndex, seatIndex);
                    const seat = seats.find(
                      (seat) => seat.seatNumber === seatId
                    );
                    const seatStatus = seat ? seat.status : "available";
                    const isReservedByAnotherUser =
                      seat &&
                      seat.status === "reserved" &&
                      seat.reservedBy !== window.localStorage.getItem("userId");
                    console.log(isReservedByAnotherUser);

                    return (
                      <div
                        key={seatId}
                        className={`seat ${seatStatus} ${
                          isReservedByAnotherUser ? "reserved-by-other" : ""
                        } ${selectedSeats.includes(seatId) ? "selected" : ""}`}
                        onClick={() => handleSeatClick(seatId)}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>

            <p className="text">
              You have selected <span id="count">{seatCount}</span> seats
            </p>
          </>
        )
      ) : (
        <p>
          Select {movie ? " " : "movie "} {dateSelected ? "" : "Date"}{" "}
          {time ? "" : "time"} to see Available Seats
        </p>
      )}
    </div>
  );
};

export default Seat;
