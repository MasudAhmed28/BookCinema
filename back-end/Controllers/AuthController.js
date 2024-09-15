const user = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const findUser = await user.findOne({ username });
    const userId = findUser._id;

    if (!findUser) {
      return res.status(401).json({ error: "invalid username or password" });
    }
    const isPasswordEqual = await bcrypt.compare(password, findUser.password);
    if (!isPasswordEqual) {
      return res.status(401).json({ error: "invalid username or password" });
    }
    const jwtSecret = process.env.JWT_SECRET;

    const jwttoken = jwt.sign(
      { username: findUser.username, _id: findUser.id },
      jwtSecret,
      { expiresIn: "2h" }
    );
    res
      .status(200)
      .json({ message: "login succesffull", jwttoken, username, userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const findUser = await user.findOne({ username });
    if (findUser) {
      console.log("user found duplicate");
      return res
        .status(401)
        .json({ data: findUser, message: "duplicate Username!" });
    } else {
      const newUser = new user({ username, password });
      newUser.password = await bcrypt.hash(password, 10);
      const saved = newUser.save();
      res.status(200).json({ data: saved, message: "registered successful!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
};
module.exports = { loginUser, registerUser };
