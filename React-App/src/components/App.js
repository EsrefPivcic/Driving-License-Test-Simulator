import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import TestPage from "./TestPage/TestPage";
import AddTestPage from "./AddTestPage/AddTestPage";
import AddQuestionPage from "./AddQuestionPage/AddQuestionPage";
import LoginPage from "./LoginPage/LoginPage";
import RegistrationPage from "./RegistrationPage/RegistrationPage";
import TestResultsPage from "./TestResultsPage/TestResultsPage";
import UserProfilePage from "./UserProfilePage/UserProfilePage";
import { useAuth } from "./AuthContext/AuthContext";
import ExamHistoryPage from "./ExamHistoryPage/ExamHistoryPage";
import AddOptionPage from "./AddOptionPage/AddOptionPage";
import "./App.css";

function App() {
  const { isAuthenticated, clearAuthStatus, ValidateToken, login, closeLogin, fetchUserData, userData, LogOut } = useAuth();
  const [message, setMessage] = useState('');
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated) {
        const isValid = await ValidateToken();
        if (!isValid) {
          clearAuthStatus();
        }
        else {
          fetchUserData();
        }
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (login) {
      setMessage('Welcome! You are now logged in.');
      fetchUserData();
      setTimeout(() => {
        setMessage('');
        closeLogin();
      }, 2000);
    }
  }, [login]);

  useEffect(() => {
    setAdmin(userData.IsAdmin);
  }, [userData]);

  const HandleLogOut = async () => {
    LogOut();
  };

  return (
    <BrowserRouter>
      <div className="app">
        <div className="app-content">
          <h1 className="app-title">
            <Link to="/">eDrivingSchool</Link>
          </h1>
          <div className="navbar">
            {isAuthenticated && (
              <div className="profile-dropdown">
                {userData.ImageBase64 && (
                  <img
                    src={`data:image/png;base64,${userData.ImageBase64}`}
                    alt={`User: ${userData.Username}`}
                    className="profile-image"
                  />
                )}
                {!userData.ImageBase64 && (<img src="images/userimage.jpg" alt={`User: ${userData.Username}`} className="profile-image" />)}
                <div className="dropdown-content">
                  <Link to={`/userprofile`} style={{ textDecoration: "none" }}>
                    <p>User Profile</p>
                  </Link>
                  <Link to={`/examhistory`} style={{ textDecoration: "none" }}>
                    <p>Exam History</p>
                  </Link>
                  {admin && (<div><Link to={`/addtest`} style={{ textDecoration: "none" }}>
                    <p>Add Test</p>
                  </Link>
                    <Link to={`/addquestion`} style={{ textDecoration: "none" }}>
                      <p>Add Question</p>
                    </Link>
                    <Link to={`/addoption`} style={{ textDecoration: "none" }}>
                      <p>Add Option</p>
                    </Link></div>)}
                  <p onClick={HandleLogOut}>Logout</p>
                </div>
              </div>
            )}
          </div>
          {message && <p className="message">{message}</p>}
          {isAuthenticated ? (
            <Routes>
              {admin && (
                <>
                  <Route path="addtest" element={<AddTestPage />} />
                  <Route path="addquestion" element={<AddQuestionPage />} />
                  <Route path="addoption" element={<AddOptionPage />} />
                </>
              )}
              <Route path="/" element={<HomePage />} />
              <Route path="examhistory" element={<ExamHistoryPage />} />
              <Route path="testresults" element={<TestResultsPage />} />
              <Route path="test" element={<TestPage />} />
              <Route path="userprofile" element={<UserProfilePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="register" element={<RegistrationPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}


export default App;