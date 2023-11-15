import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

async function validateToken(token) {
  try {
    const response = await fetch('http://localhost:8080/checktoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token validation failed:', error);
  }
}

function HomePage({ testData }) {
  const storedToken = localStorage.getItem('token');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (storedToken) {
        const isValid = await validateToken(storedToken);

        if (!isValid) {
          localStorage.removeItem('token');
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
        }
      }
    };

    checkToken();
  }, [storedToken]);

  useEffect(() => {
    if (isLoggedIn) {
      setMessage('Welcome! You are now logged in.');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  }, [isLoggedIn]);

  const logout = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.removeItem('token');
      setLoggedIn(false);
      navigate('/');
      setMessage('You have been successfully logged out.');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    if (isLoggedIn) {
      setMessage('You have been successfully logged out.');
      logout();
    } else {
      setLoggedIn(!isLoggedIn);
      setMessage('Welcome! You are now logged in.');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="categories">
      {message && <p className="message">{message}</p>}
      <div className="login">
        {isLoggedIn ? (
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
              <p onClick={logout}>Logout</p>
            </div>
          </div>
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