import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./ExamHistoryPage.css";

function ExamHistoryPage() {
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

    if (!attemptsData) {
        return (
            <div className="examhistoryempty">Exam history is empty.</div>
        );
    }
    else {
        return (
            <div className="examhistory">
                <h2>Exam History</h2>
                {attemptsData.map((attempt, index) => (
                    <div key={index} className="attemptbutton"
                    onClick={() => navigate(`/testresults`, { state: { attempt } })}
                    style={{ textDecoration: "none", color: "white" }}
                    >
                    <div className="attempt-container"> 
                        <img src={`data:image/png;base64, ${attempt.Test.ImageBase64}`} alt="Test Image" />
                        <div className="attempt-details">
                            <p><strong>Exam:</strong> {attempt.Test.Title}</p>
                            <p><strong>Category:</strong> {attempt.Test.Category}</p>
                            <p><strong>Score:</strong> {attempt.Score}/{attempt.MaxScore} ({attempt.Percentage}%)</p>
                            <p>{attempt.Passed ? (
                                    <strong className="result-passed">Passed!</strong>
                            ) : (
                                    <strong className="result-failed">Failed!</strong>
                            )}</p>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default ExamHistoryPage;
