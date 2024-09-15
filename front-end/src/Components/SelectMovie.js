import React, { useContext } from "react";
import RadioComponent from "./RadioComponent";

import BsContext from "../Context/BsContext";
import "../Css/SelectMovie.css";

const SelectMovie = ({ movieTitles }) => {
  const context = useContext(BsContext);

  const { movie, changeMovie } = context;

  const handleChangeMovie = (value) => {
    changeMovie(value);
    window.localStorage.setItem("movie", value);
  };

  return (
    <>
      <div className="SM_main_container">
        {movieTitles.map((el, index) => {
          return (
            <RadioComponent
              text={el}
              changeSelection={handleChangeMovie}
              data={movie}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
};

export default SelectMovie;
