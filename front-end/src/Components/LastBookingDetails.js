import React, { useEffect, useContext } from "react";
import "../Css/LastBookingDetails.css";
import BsContext from "../Context/BsContext";

import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

const LastBookingDetails = () => {
  const context = useContext(BsContext);
  const navigate = useNavigate();
  const {
    handleGetLastBooking,
    lastBookingDetails,
    loggedinUser,
    setloggedinUser,
  } = context;

  useEffect(() => {
    setloggedinUser(localStorage.getItem("loggedinUser"));
    handleGetLastBooking();
  }, []);

  const handleLogOut = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedinUser");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  const onGenreSelect = (genre) => {
    navigate(`/home?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="last_booking_details_container_main">
      <Topbar onGenreSelect={onGenreSelect} />
      <div className="go_back">
        <a href="/home">Go back</a>
      </div>
      <h2 className="last_booking_details_header">Last Booking Details:</h2>
      {lastBookingDetails ? (
        <>
          <p className="ticket">
            Ticket No : {lastBookingDetails.ticketNumber}
          </p>
          <div className="seats_container">
            <p className="seats_header">Seats:</p>
          </div>
          <p className="slot" style={{ textAlign: "left" }}>
            Slot: <span>{lastBookingDetails.slot}</span>
          </p>
          <p className="movie">
            Movie: <span>{lastBookingDetails.movie}</span>
            <br></br>
            <img src={lastBookingDetails.imageData.imageUrl} alt="test"></img>
          </p>
        </>
      ) : (
        <p className="no_previous_booking_msg">No Previous Booking Found!</p>
      )}
      <div>
        <h2>{loggedinUser}</h2>
        <button onClick={handleLogOut}>LogOut</button>
      </div>
    </div>
  );
};

export default LastBookingDetails;
