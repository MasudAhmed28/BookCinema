const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { verifyOTP, otpStore } = require("../Controllers/Otpsender");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dmyaccnt2023@gmail.com",
    pass: "sazi lwnw kvjg fjrr", // Use the App Password generated in the previous step
  },
});

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(403).json({ message: "Please Login or Signup To Book" });
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Please Login or Signup To Book" });
  }
};

const otpVerification = (req, res, next) => {
  const email = req.body.email;

  const otp = req.body.otp;

  const result = verifyOTP(email, otp);
  if (!result) {
    return res.status(403).json({ message: "Incorrect OTP" });
  } else {
    next();
  }
};
module.exports = {
  ensureAuthenticated,
  otpVerification,
};
