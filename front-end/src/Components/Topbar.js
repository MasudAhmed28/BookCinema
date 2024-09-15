import React, { useState } from "react";
import "../Css/Topbar.css"; // Import CSS for styling
import logo from "../Images/logo.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Topbar = ({ onGenreSelect, onSearch, hiddenMenuItems = [] }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev); // Toggle sidebar
  };

  const handleLogout = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("loggedinUser");
    // localStorage.removeItem("slot");
    window.localStorage.clear();
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate(`/home?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  const isHidden = (menuItem) => hiddenMenuItems.includes(menuItem);
  const loggedinUser = window.localStorage.getItem("loggedinUser");
  console.log(loggedinUser);

  return (
    <>
      <div className="top-bar">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-name">FINEMA</span>
          <button
            className="premium-button"
            onClick={() => navigate("/getpremium")}
          >
            <span className="premium-icon">👑</span> Go Premium
          </button>
        </div>
        <div className="nav-menu">
          <a
            href="/home"
            onClick={() => onGenreSelect("")}
            className={isHidden("Home") ? "hidden" : ""}
          >
            Home
          </a>
          <a
            href="#scifi"
            onClick={() => onGenreSelect("Science Fiction")}
            className={isHidden("SciFi") ? "hidden" : ""}
          >
            SciFi
          </a>
          <a
            href="#action"
            onClick={() => onGenreSelect("Action")}
            className={isHidden("Action") ? "hidden" : ""}
          >
            Action
          </a>
          <a
            href="#romance"
            onClick={() => onGenreSelect("Romance")}
            className={isHidden("Romance") ? "hidden" : ""}
          >
            Romance
          </a>
          <a
            href="/lastBooking"
            className={isHidden("LastBooking") ? "hidden" : ""}
          >
            LastBooking
          </a>
        </div>

        <div className="right-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Movies, Shows and more"
              className={`search-box ${isHidden("search") ? "hidden" : ""}`}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-icon" onClick={handleSearch}>
              🔍
            </button>
          </div>
          <div className={`joinbtn ${loggedinUser ? "hide" : "show"}`}>
            <button>
              <a style={{ color: "white" }} href="/landingpage">
                Login/SignUp
              </a>
            </button>
          </div>

          <div className="profile-container">
            <div className="profile-icon" onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <button style={{ color: "black" }} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="burger-menu" onClick={toggleSidebar}>
            <div className="burger-bar"></div>
            <div className="burger-bar"></div>
            <div className="burger-bar"></div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? "active" : ""}`}>
        <div className="close-sidebar" onClick={toggleSidebar}>
          ✖
        </div>
        {!hiddenMenuItems.includes("Home") && (
          <a href="/home" onClick={() => onGenreSelect("")}>
            Home
          </a>
        )}
        {!hiddenMenuItems.includes("SciFi") && (
          <a href="#scifi" onClick={() => onGenreSelect("Science Fiction")}>
            SciFi
          </a>
        )}
        {!hiddenMenuItems.includes("Action") && (
          <a href="#action" onClick={() => onGenreSelect("Action")}>
            Action
          </a>
        )}
        {!hiddenMenuItems.includes("Romance") && (
          <a href="#romance" onClick={() => onGenreSelect("Romance")}>
            Romance
          </a>
        )}
        {!hiddenMenuItems.includes("LastBooking") && (
          <a href="/lastBooking">LastBooking</a>
        )}
      </div>
    </>
  );
};

export default Topbar;
