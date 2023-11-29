import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
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

  return (
    <div>
      <div className="categories">
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
    </div>
  );
}

export default HomePage;