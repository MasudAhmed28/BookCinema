const mongoose = require("mongoose");

const moviesList = new mongoose.Schema({
  title: { type: String },
  genre: { type: String },
  releaseDate: { type: Date },
  image: { type: String },
});
const movie = mongoose.model("movieList", moviesList);

module.exports = movie;
