import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import "./HomePage.css";

function HomePage() {
  const [testData, setTestData] = useState([]);
  const navigate = useNavigate();
  const [isComponentVisible, setComponentVisible] = useState(false);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
});

  const fetchTestsData = async () => {
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
    fetchTestsData();
    setTimeout(() => {
      setComponentVisible(true);
    }, 100);
  }, []);

  return (
      <animated.div className="categories" style={fadeIn}>
        {testData ? (testData.map((test) => (
          <div className="testButton"
            key={test.ID}
            onClick={() => navigate(`/test`, { state: { test } })}
            style={{ textDecoration: "none", color: "white" }}
          >
            <button className="button-style" key={test.ID}>
              <img
                src={`data:image/png;base64,${test.ImageBase64}`}
                alt={`Test: ${test.Title}`}
                className="category-image"
              />
              <h2>{test.Title}</h2>
              <p>{test.Description}</p>
            </button>
          </div>
        ))) : 
        <div>
        No tests available.
      </div>}       
      </animated.div>
  );
}

export default HomePage;