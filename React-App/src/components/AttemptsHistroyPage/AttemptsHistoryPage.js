import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./AttemptsHistoryPage.css";

function AttemptsHistoryPage() {
    const { authToken } = useAuth();
    const [attemptsData, setAttemptsData] = useState([]);
    const navigate = useNavigate();

    const fetchAttemptsData = async () => {
        const token = authToken;
        try {
            const response = await fetch('http://localhost:8080/attempts/getbystudentid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setAttemptsData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAttemptsData();
    }, []);

    return (
        <div className="attempthistory">
            <h2>Attempt History</h2>
            {attemptsData.map((attempt, index) => (
                <div className="attemptbutton"
                onClick={() => navigate(`/testresults`, { state: { attempt } })}
                style={{ textDecoration: "none", color: "white" }}
                >
                <div key={index} className="attempt-container">
                    <img src={`data:image/png;base64, ${attempt.Test.ImageBase64}`} alt="Test Image" />
                    <div className="attempt-details">
                        <p>Attempt for test: {attempt.Test.Title}</p>
                        <p>Test Category: {attempt.Test.Category}</p>
                        <p>Score/Max Score: {attempt.Score}/{attempt.MaxScore} ({attempt.Percentage}%)</p>
                    </div>
                </div>
                </div>
            ))}
        </div>
    );
}

export default AttemptsHistoryPage;
