import React, { useContext, useEffect, useState } from "react";
import RadioComponent from "./RadioComponent";
import { slottime } from "../data";
import "../Css/TimeShedule.css";
import BsContext from "../Context/BsContext";

const TimeShedule = () => {
  const context = useContext(BsContext);
  const [slots, setSlots] = useState([]);
  const { time, changeTime, dateSelected, setDateSelected } = context;

  useEffect(() => {
    if (slottime) {
      setSlots([...slottime]);
    }

    const savedSlot = window.localStorage.getItem("slot");
    const savedDate = window.localStorage.getItem("XdateSelected");

    if (!savedSlot) {
      changeTime("");
    }

    if (savedDate) {
      setDateSelected(savedDate); // Directly set the string as date
    }
  }, [changeTime, setDateSelected]);

  const handleChangeTime = (value) => {
    changeTime(value);
    window.localStorage.setItem("slot", value); // Save slot in localStorage
  };

  const handleChangeDate = (e) => {
    setDateSelected(e.target.value); // Store as string
    window.localStorage.setItem("XdateSelected", e.target.value); // Save as string
  };

  return (
    <>
      <div className="container">
        <label>
          Date:
          <input type="date" value={dateSelected} onChange={handleChangeDate} />
        </label>
      </div>
      <div className="Slot_container">
        <div className="TS_main_container">
          {slots.map((el, index) => (
            <RadioComponent
              text={el}
              changeSelection={handleChangeTime}
              data={time}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TimeShedule;
