import React from "react";
import "./App.css";
import BsState from "./Context/BsState";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import Home from "./Pages/Home";
import "react-toastify/dist/ReactToastify.css";
import LastBookingDetails from "./Components/LastBookingDetails";
import MovieList from "./Pages/moviesDiplay";

import LandingPage from "./Pages/LandingPage";
import Topbar from "./Components/Topbar";
import Premium from "./Pages/Premium";
import Seat from "./Components/Seat";
import AdminPanel from "./Pages/AdminPage";

function App() {
  return (
    <BsState>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/top" element={<Topbar />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/lastBooking" element={<LastBookingDetails />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<MovieList />} />

          <Route path="/getpremium" element={<Premium />} />
          <Route path="/seat" element={<Seat />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </BsState>
  );
}

export default App;
