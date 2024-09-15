const nodemailer = require("nodemailer");
const OTP = require("../Models/OtpSchema");
const user = require("../Models/UserSchema");

async function storeOtp(email, otp) {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const otpinfo = {
      email,
      otp,
      expiresAt,
    };
    const savedData = await OTP.insertMany(otpinfo);
  } catch (error) {}
}

function otpGenerator(length = 6) {
  const max = Math.pow(10, length - 1);
  const min = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function verifyOTP(email, otp) {
  try {
    const myData = await OTP.findOne({ email }).sort({ _id: -1 });
    if (!myData) return callback(false);
    console.log(myData.otp);
    if (otp === myData.otp) {
      return true;
    }
  } catch (error) {}
}
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dmyaccnt2023@gmail.com",
    pass: "sazi lwnw kvjg fjrr", // Use the App Password generated in the previous step
  },
});

const sendOtp = async (req, res) => {
  const recipientEmail = req.body.email;
  const otpGenerated = otpGenerator(6);
  storeOtp(recipientEmail, otpGenerated);

  const mailOptions = {
    from: "dmyaccnt2023@gmail.com",
    to: recipientEmail,
    subject: "Your OTP Code",
    text: `Your otp is :${otpGenerated}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);

      return res.status(500).json({ message: "failed msg" });
    } else {
      res.status(200).json({ message: "data sennt" });
    }
  });
};
module.exports = { sendOtp, verifyOTP };
