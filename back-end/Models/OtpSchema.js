const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email: { type: String },
  otp: { type: Number },
  expiresAt: { type: Date },
});
const otp = mongoose.model("otp", otpSchema);
module.exports = otp;
