const express = require("express");
const router = express.Router();
const Ticket = require("../Models/schema");
const cors = require("cors");
const app = express();
const user = require("../Models/UserSchema");
router.use(express.json());
const jwt = require("jsonwebtoken");
const bookingcontroller = require("../Controllers/BookingController");
const authController = require("../Controllers/AuthController");
const {
  ensureAuthenticated,
  otpVerification,
  registerDataVerification,
} = require("../Middlewares/Auth");
const { isAdmin } = require("../Middlewares/isAdmin");
const {
  createNewMovie,
  getMoviesList,
  getAvailableSeats,
  createShowSeat,
} = require("../Controllers/MovieListController");
const { sendOtp } = require("../Controllers/Otpsender");
const movie = require("../Models/MovieList");

router.use(cors());

router.post("/booking", ensureAuthenticated, bookingcontroller.bookMovie);
router.get("/booking", ensureAuthenticated, bookingcontroller.getLastBooking);
router.post("/register", otpVerification, authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/createMovie", isAdmin, createNewMovie);
router.get("/movieList", getMoviesList);
router.post("/otp", sendOtp);

router.get("/seats", getAvailableSeats);
router.post("/create-shows", createShowSeat);

module.exports = router;
