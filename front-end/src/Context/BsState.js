import React, { useState, useEffect } from "react";
import BsContext from "./BsContext";

const BsState = (props) => {
  const [errorPopup, setErrorPopup] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [time, changeTime] = useState("");

  const [movie, changeMovie] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [lastBookingDetails, setLastBookingDetails] = useState(null);
  const [loggedinUser, setloggedinUser] = useState("");
  const [dateSelected, setDateSelected] = useState("");

  const handlePostBooking = async () => {
    console.log(movie);
    console.log(selectedSeats);
    console.log(loggedinUser);
    console.log(dateSelected);
    console.log(localStorage.getItem("token"));
    const response = await fetch(`http://localhost:8080/api/booking`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieSelected: movie,
        slot: time,
        //seats: noOfSeat,
        selectedseat: selectedSeats,
        userBooked: window.localStorage.getItem("loggedinUser"),
        selecteddate: dateSelected,
      }),
    });

    const data = await response.json();

    setErrorPopup(true);
    setErrorMessage(data.message);

    if (response.status === 200) {
      changeTime("");
      changeMovie("");
      setDateSelected("");
      setLastBookingDetails(data.data);

      //window.localStorage.clear();
    }
  };

  const handleGetLastBooking = async () => {
    const response = await fetch(`http://localhost:8080/api/booking`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    setLastBookingDetails(data.data);
  };

  useEffect(() => {
    const movie = window.localStorage.getItem("movie");
    const slot = window.localStorage.getItem("slot");
    const findDate = window.localStorage.getItem("XdateSelected");
    console.log(findDate);

    const selectedSeatsData = window.localStorage.getItem("movieSeatData");

    const parsedData = JSON.parse(selectedSeatsData);

    const selectedSeats = parsedData?.[movie]?.[slot] || [];

    if (movie) {
      changeMovie(movie);
    }
    if (slot) {
      changeTime(slot);
    }
    if (findDate) {
      setDateSelected(findDate);
    }

    if (selectedSeats) {
      setSelectedSeats(selectedSeats);
    }
  }, []);

  return (
    <BsContext.Provider
      value={{
        handlePostBooking,
        handleGetLastBooking,
        movie,
        changeMovie,
        time,
        changeTime,
        dateSelected,
        setDateSelected,
        lastBookingDetails,
        errorPopup,
        setErrorPopup,
        errorMessage,
        setErrorMessage,
        loggedinUser,
        setloggedinUser,
        selectedSeats,
        setSelectedSeats,
      }}
    >
      {props.children}
    </BsContext.Provider>
  );
};
export default BsState;
