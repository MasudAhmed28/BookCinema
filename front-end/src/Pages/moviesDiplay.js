import React, { useState, useEffect, useContext } from "react";
import "../Css/DisplayMovies.css";
import RadioComponent from "../Components/RadioComponent";
import BsContext from "../Context/BsContext";

const MovieList = ({ selectedGenre, searchQuery }) => {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(4);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const context = useContext(BsContext);
  const { movie, changeMovie } = context;

  useEffect(() => {
    // Handle window resizing
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMoviesPerPage(movieList.length);
      } else {
        setMoviesPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [movieList.length]);

  useEffect(() => {
    // Fetch movies from API
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://bookcinema-backend.onrender.com/api/movieList");
        const result = await response.json();

        if (result.data) {
          setMovieList(result.data);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Filter movies based on genre and search query
    const filtered = movieList.filter((movie) => {
      return (
        (selectedGenre === "" || movie.genre === selectedGenre) &&
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredMovies(filtered);
  }, [movieList, selectedGenre, searchQuery]);

  useEffect(() => {
    // Sync selected movie with local storage
    if (movie) {
      window.localStorage.setItem("movie", movie);
    }
  }, [movie]);

  const handleChangeMovie = (value) => {
    changeMovie(value);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMovies.length / moviesPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * moviesPerPage;
  const selectedMovies = filteredMovies.slice(
    startIndex,
    startIndex + moviesPerPage
  );

  return (
    <div className={`movie-list ${selectedMovies.length > 0 ? "" : "no"}`}>
      <div className="arrow arrow-left" onClick={handlePrevPage}>
        &lt;
      </div>
      {selectedMovies.length > 0 ? (
        selectedMovies.map((el, index) => (
          <div key={index} className="movie-card">
            <img src={el.imageUrl} alt={el.title} className="movie-image" />
            <p>Genre: {el.genre}</p>
            <p>Release Date: {new Date(el.releaseDate).toDateString()}</p>
            <RadioComponent
              text={el.title}
              changeSelection={handleChangeMovie}
              data={movie}
            />
          </div>
        ))
      ) : (
        <p className="No_movies">No Movies Found</p>
      )}
      <div className="arrow arrow-right" onClick={handleNextPage}>
        &gt;
      </div>
    </div>
  );
};

export default MovieList;
