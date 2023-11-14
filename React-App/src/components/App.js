import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import TestPage from "./TestPage/TestPage";
import AddTestPage from "./AddTestPage/AddTestPage";
import AddQuestionPage from "./AddQuestionPage/AddQuestionPage";
import "./App.css";
import LoginPage from "./LoginPage/LoginPage";
import RegistrationPage from "./RegistrationPage/RegistrationPage";
import TestResultsPage from "./TestResultsPage/TestResultsPage";

function App() {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    fetchTestData();
  }, []);

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

  return (
    <BrowserRouter>
      <div className="app">
        <div className="app-content">
          <h1 className="app-title">
            <Link to="/">eDrivingSchool</Link>
          </h1>
          <Routes>
            <Route path="addtest" element={<AddTestPage />}></Route>
            <Route path="addquestion" element={<AddQuestionPage />}></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="register" element={<RegistrationPage />}></Route>
            <Route path="testresults" element={<TestResultsPage />}></Route>
            <Route path="/" element={<HomePage testData={testData} />} />
            {Object.keys(testData).map((test) => (
              <Route
                key={testData[test].ID}
                path={`/${testData[test].Category.toLowerCase()}test`}
                element={
                  testData[test].Category === "A" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "B" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "C" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "D" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "T" ? (
                    <TestPage test={test} testData={testData} />
                  ) : (
                    <TestPage test={test} testData={testData} />
                  )
                }
              />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;