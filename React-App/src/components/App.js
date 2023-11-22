import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate  } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import TestPage from "./TestPage/TestPage";
import AddTestPage from "./AddTestPage/AddTestPage";
import AddQuestionPage from "./AddQuestionPage/AddQuestionPage";
import "./App.css";
import LoginPage from "./LoginPage/LoginPage";
import RegistrationPage from "./RegistrationPage/RegistrationPage";
import TestResultsPage from "./TestResultsPage/TestResultsPage";
import UserProfilePage from "./UserProfilePage/UserProfilePage";
import { useAuth } from "./AuthContext/AuthContext";
import ExamHistoryPage from "./ExamHistoryPage/ExamHistoryPage";

function App() {
  const { isAuthenticated, clearAuthStatus, ValidateToken, login, closeLogin } = useAuth();
  const [message, setMessage] = useState('');

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
        closeLogin();
      }, 2000);
    }
  }, [login]);

  return (
    <BrowserRouter>
      <div className="app">
        <div className="app-content">
          <h1 className="app-title">
            <Link to="/">eDrivingSchool</Link>
          </h1>
          {message && <p className="message">{message}</p>}
          {isAuthenticated ? (<Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="addtest" element={<AddTestPage />}></Route>
            <Route path="addquestion" element={<AddQuestionPage />}></Route>
            <Route path="examhistory" element={<ExamHistoryPage />}></Route>
            <Route path="testresults" element={<TestResultsPage />}></Route>
            <Route path="test" element={<TestPage/>}></Route>
            <Route path="userprofile" element={<UserProfilePage />}></Route>
            <Route path="*" element={<Navigate to="/" />} />          
          </Routes>) : (<Routes>
            <Route path="/" element={<LoginPage />}></Route>     
            <Route path="register" element={<RegistrationPage />}></Route>
            <Route path="*" element={<Navigate to="/" />} />      
            </Routes>
          )}      
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;