import React, { useState, useEffect } from "react";
import "../Css/AdminPage.css";

const AdminPanel = () => {
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([
    "10:00 AM",
    "1:00 PM",
    "3:00 PM",
    "8:00 PM",
    "10:00 PM",
  ]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch movies from API

    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/movieList");
        const result = await response.json();

        if (result.data) {
          setMovies(result.data);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleSubmit = () => {
    const payload = {
      date,
      timeSlots: selectedTimeSlots,
      movieId: selectedMovie,
    };

    fetch("http://localhost:8080/api/create-shows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Shows and seats created successfully!");
        } else {
          setMessage("Error creating shows and seats.");
        }
      })
      .catch((error) =>
        console.error("Error creating shows and seats:", error)
      );
  };

  return (
    <div className="admin-panel-container">
      <h1>Create Shows and Seats</h1>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>
        Movie:
        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
        >
          <option value="">Select a movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Time Slots:
        <div>
          {timeSlots.map((time) => (
            <label key={time}>
              <input
                type="checkbox"
                value={time}
                checked={selectedTimeSlots.includes(time)}
                onChange={(e) => {
                  const newTimeSlots = e.target.checked
                    ? [...selectedTimeSlots, time]
                    : selectedTimeSlots.filter((slot) => slot !== time);
                  setSelectedTimeSlots(newTimeSlots);
                }}
              />
              {time}
            </label>
          ))}
        </div>
      </label>
      <button onClick={handleSubmit}>Create Shows and Seats</button>
      {message && (
        <div
          className={`message ${
            message.includes("success") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
