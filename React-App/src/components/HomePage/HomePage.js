import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./HomePage.css";

function HomePage() {
  const { isAuthenticated, LogOut } = useAuth();
  const [testData, setTestData] = useState([]);
  const navigate = useNavigate();

  const fetchTestData = async () => {
    try {
      const response = await fetch("http://localhost:8080/tests/get");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTestData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const HandleLogOut = async () => {
    LogOut();
  };

  return (
    <div>
      <div className="categories">
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
                <Link to={`/examhistory`} style={{ textDecoration: "none" }}>
                  <p>Exam History</p>
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
          <div className="testButton"
            key={test.ID}
            onClick={() => navigate(`/test`, { state: { test } })}
            style={{ textDecoration: "none", color: "white" }}
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
          </div>
        ))}
      </div>
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