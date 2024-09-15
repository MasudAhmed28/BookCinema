import React from "react";
import "../Css/LandingPage.css"; // Import the CSS file for styling
import popcorn from "../Images/popcorn.png";

import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="movie-booking-container">
      <div className="logo-container">
        <h2>FINEMA</h2>
      </div>

      {/* Movie booking card */}
      <div className="movie-booking-card">
        <h2>Movie Booking</h2>
        <p>
          Experience the magic of cinema like never before with our streamlined
          movie booking platform. Whether you're planning a fun night out with
          friends, a romantic date, or a family outing, booking your favorite
          movies has never been easier. Explore a vast selection of the latest
          blockbusters, timeless classics, and exclusive releases, all from the
          comfort of your home. Our platform offers real-time seat availability,
          secure payment options, and personalized recommendations based on your
          viewing history. Dive into a world of immersive entertainment where
          every movie ticket opens the door to new adventures, emotions, and
          unforgettable moments. Join our community of movie lovers today, and
          let the silver screen come alive with stories that captivate and
          inspire. Enjoy hassle-free bookings, exclusive discounts, and much
          more as you create lasting memories with every visit to the cinema.
        </p>
        <div className="form-buttons">
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="signup-button"
            onClick={() => navigate("/registration")}
          >
            Signup
          </button>
        </div>
      </div>

      {/* Popcorn image graphic */}
      <div className="movie-graphic">
        <div className="graphic-elements">
          <img src={popcorn} alt="Popcorn" className="popcorn-image" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
