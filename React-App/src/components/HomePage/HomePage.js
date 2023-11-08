import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage({ testData }) {
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setLoggedIn(false);
    } else {
      setLoggedIn(!isLoggedIn);
    }
  };

  return (
    <div className="categories">
      <div className="login">
        {isLoggedIn ? (
          <button className="login-button" onClick={handleLogin}>
            Logout
          </button>
        ) : (
          <Link to={`/login`} style={{ textDecoration: "none" }}>
            <button className="login-button" onClick={handleLogin}>
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