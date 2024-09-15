import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/LoginPage.css";
import BsContext from "../Context/BsContext";
import Modal from "../Components/ModalComponent";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const context = useContext(BsContext);
  const { setErrorPopup, setErrorMessage } = context;

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        loginData
      );
      console.log(response.data);

      if (response.status === 200) {
        navigate("/home");
        localStorage.setItem("token", response.data.jwttoken);
        localStorage.setItem("loggedinUser", response.data.username);
        localStorage.setItem("userId", response.data.userId);
      } else {
        setErrorPopup(true);
        setErrorMessage("Incorrect Username or Password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorPopup(true);
      setErrorMessage("Incorrect Username or Password!");
    }
  };

  return (
    <>
      <Modal />
      <div className="login-container">
        <div className="logo-container">
          <h2>FINEMA</h2>
        </div>
        <h1>Login Form</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="username_input">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={loginData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="password_input">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p style={{ color: "black" }}>
          Not an User?<a href="/registration">Register here</a>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
