const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const user = mongoose.model("User", UserSchema);
module.exports = user;
