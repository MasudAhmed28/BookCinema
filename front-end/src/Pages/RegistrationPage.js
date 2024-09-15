import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/RegistrationPage.css";
import BsContext from "../Context/BsContext";
import Modal from "../Components/ModalComponent";

const RegistrationPage = () => {
  const { setErrorPopup, setErrorMessage } = useContext(BsContext);
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
    otpError: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: "",
    }));
  };
  const validateInputs = () => {
    const { username, email, password } = registerData;
    const newErrors = {};

    if (username.trim() === "") {
      newErrors.usernameError = "Username is required";
    } else if (username.length < 3) {
      newErrors.usernameError = "Username must be at least 3 characters";
    }

    if (email.trim() === "") {
      newErrors.emailError = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.emailError = "Enter a valid email";
    }

    if (password.trim() === "") {
      newErrors.passwordError = "Password is required";
    } else if (password.length < 6) {
      newErrors.passwordError = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const sendOtp = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      try {
        const response = await axios.post(
          "https://bookcinema-backend.onrender.com/api/otp",
          registerData
        );
        if (response.status === 200) {
          setErrorPopup(true);
          setErrorMessage("Otp sent successfully");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          otpError: error.response?.data?.message || "Error sending OTP",
        }));
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bookcinema-backend.onrender.com/api/register",
        registerData
      );

      if (response.status === 200) {
        navigate("/login");
      }
      if (response.status === 500) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterData((prevData) => ({
        ...prevData,
        otp: "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        usernameError: error.response.data.message,
      }));
    }
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <>
      <Modal />
      <div className="login-container">
        <h1>Register</h1>
        <form onSubmit={handleFormSubmit}>
          <div
            className={`form-control ${
              errors.usernameError ? "error" : "success"
            }`}
          >
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={registerData.username}
              onChange={handleInputChange}
            />
            {errors.usernameError && (
              <p className="error-text">{errors.usernameError}</p>
            )}
          </div>
          <div
            className={`form-control ${
              errors.emailError ? "error" : "success"
            }`}
          >
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleInputChange}
            />
            {errors.emailError && (
              <p className="error-text">{errors.emailError}</p>
            )}
          </div>
          <div
            className={`form-control ${
              errors.passwordError ? "error" : "success"
            }`}
          >
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleInputChange}
            />
            {errors.passwordError && (
              <p className="error-text">{errors.passwordError}</p>
            )}
          </div>
          <button type="button" onClick={sendOtp}>
            Generate OTP
          </button>
          <div
            className={`form-control ${errors.otpError ? "error" : "success"}`}
          >
            <label>OTP:</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={registerData.otp}
              onChange={handleInputChange}
            />
            {errors.otpError && <p className="error-text">{errors.otpError}</p>}
          </div>
          <button type="submit">Register</button>
        </form>
        <p style={{ color: "black" }}>
          Already a user? <a href="/login">Login here</a>
        </p>
      </div>
    </>
  );
};

export default RegistrationPage;
