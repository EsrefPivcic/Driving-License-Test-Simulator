import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./HomePage.css";

function HomePage({ testData }) {

  const { isAuthenticated, clearAuthStatus, ValidateToken, LogOut } = useAuth();
  const [message, setMessage] = useState('');
  const location = useLocation();
  const [login, setLogin] = useState(location.state?.login);

  useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated) {
        const isValid = await ValidateToken();
        if (!isValid) {
          clearAuthStatus();
        } 
      }
    };
    checkToken();
  }, [isAuthenticated, ValidateToken, clearAuthStatus]);

  useEffect(() => { 
    if (login) {
      setMessage('Welcome! You are now logged in.');
      setTimeout(() => {
        setMessage('');
        setLogin(false);
      }, 2000);
    }
  }, [login]);

  const HandleLogOut = async () => {
      LogOut();
  };

  return (
    <div className="categories">
      {message && <p className="message">{message}</p>}
      <div className="login">
        {isAuthenticated ? (
          <div className="profile-dropdown">
            <img
              src="images/userimage.jpg"
              alt="User Profile"
              className="profile-image"
            />
            <div className="dropdown-content">
              <Link to={`/userprofile`} style={{ textDecoration: "none" }}>
                <p>User Profile</p>
              </Link>
              <p onClick={HandleLogOut}>Logout</p>
            </div>
          </div>
        ) : (
          <Link to={`/login`} style={{ textDecoration: "none" }}>
            <button className="login-button">
              Login
            </button>
          </Link>
        )}
      </div>
      {testData.map((test) => (
        <Link
          key={test.ID}
          to={`/${test.Category.toLowerCase()}test`}
          style={{ textDecoration: "none" }}
        >
          <button className="buttonStyle" key={test.ID}>
            <img
              src={`data:image/png;base64,${test.ImageBase64}`}
              alt={`Test: ${test.Title}`}
              className="category-image"
            />
            <h2>{test.Title}</h2>
            <p>{test.Description}</p>
          </button>
        </Link>
      ))}
      <div>
        <Link to={`/addtest`} style={{ textDecoration: "none" }}>
          <button className="buttonStyleAdd">
            <h2>Add Test</h2>
          </button>
        </Link>
        <Link to={`/addquestion`} style={{ textDecoration: "none" }}>
          <button className="buttonStyleAdd">
            <h2>Add Question</h2>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;