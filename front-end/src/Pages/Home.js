import MovieList from "./moviesDiplay";
import TimeShedule from "../Components/TimeShedule";
import Modal from "../Components/ModalComponent";
import "../Css/Home.css";
import BsContext from "../Context/BsContext";
import { useContext, useEffect, useState } from "react";
import Topbar from "../Components/Topbar";
import { useLocation } from "react-router-dom";
import Seat from "../Components/Seat";

const Home = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(BsContext);
  const location = useLocation();
  const {
    movie,
    time,
    //noOfSeat,
    handlePostBooking,
    setErrorPopup,
    setErrorMessage,
  } = context;

  // const checkNegativeSeatsValidity = (seats) => {
  //   for (let seat in seats) {
  //     if (Number(seats[seat]) < 0) {
  //       return true;
  //     }
  //   }

  //   return false;
  // };

  // const checkZeroSeatsValidity = (seats) => {
  //   for (let seat in seats) {
  //     if (Number(seats[seat]) > 0) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const handleBookNow = () => {
    if (!movie) {
      setErrorPopup(true);
      setErrorMessage("Please select  a movie!");
    } else if (!time) {
      setErrorPopup(true);
      setErrorMessage("Please select a time slot!");
    } else {
      handlePostBooking();
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genre = params.get("genre") || "";
    const search = params.get("search") || "";
    setSelectedGenre(genre);
    setSearchQuery(search);
  }, [location.search]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Modal />
      <Topbar onGenreSelect={setSelectedGenre} onSearch={handleSearch} />
      <MovieList selectedGenre={selectedGenre} searchQuery={searchQuery} />

      <div className="container">
        <div className="selection_container">
          <div className="wrapper">
            <div className="select_movie_component"></div>
          </div>
          <div className="time_seats_container">
            <TimeShedule />
            {/* <SelectSeats /> */}
            <Seat />
            <button
              onClick={() => {
                handleBookNow();
              }}
              className="BN-btn "
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
