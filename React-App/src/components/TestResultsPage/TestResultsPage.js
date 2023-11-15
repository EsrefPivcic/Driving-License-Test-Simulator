import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import "./TestResultsPage.css";

function TestResultsPage() {

    const location = useLocation();
    const attempt = location.state?.attempt;

    const navigate = useNavigate();
    const [isComponentVisible, setComponentVisible] = useState(false);
    const [questionData, setQuestionData] = useState([]);
    const [testData, setTestData] = useState({});
    const [studentResponsesData, setStudentResponsesData] = useState([]);
    const [optionData, setOptionData] = useState([]);

    const fadeIn = useSpring({
        opacity: isComponentVisible ? 1 : 0,
        from: { opacity: 0 },
    });

    const fetchTestData = async () => {
        try {
            const response = await fetch("http://localhost:8080/test/getbyid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testid: attempt.TestID }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTestData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchQuestionData = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/questions/getbyids",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Questions: testData.Questions }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setQuestionData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchOptionData = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/options/getbyquestionids",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Questions: testData.Questions }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setOptionData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchStudentResponsesData = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/studentresponses/getbyattemptid",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ attemptid: attempt.ID }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setStudentResponsesData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchTestData();
            await fetchStudentResponsesData();
        };

        fetchData();
    }, [attempt]);

    useEffect(() => {
        if (testData.Questions) {
            fetchQuestionData();
            fetchOptionData();
            setComponentVisible(true);
        }
    }, [testData]);

    const passed = attempt.Passed;
    const score = attempt.Score;
    const maxScore = attempt.MaxScore;
    const percentage = ((score / maxScore) * 100).toFixed(2);

    const renderOptions = (questionID, selectedOptions, correctOptions) => {
        return optionData
            .filter((option) => option.QuestionID === questionID)
            .map((option) => (
                <div
                    key={option.ID}
                    className={`result-option ${selectedOptions.includes(option.ID)
                        ? option.IsCorrect
                            ? "result-selected-correct"
                            : "result-selected-incorrect"
                        : ""
                        }`}
                >
                    {option.OptionText}
                </div>
            ));
    };

    const renderQuestions = () => {
        return questionData.map((question) => {
            const response = studentResponsesData.find(
                (r) => r.QuestionID === question.ID
            );

            return (
                <div key={question.ID} className="result-question-container">
                    <div className="result-question-text">{question.QuestionText}</div>
                    <div className="result-options-container">
                        {renderOptions(
                            question.ID,
                            response ? response.SelectedOptions : [],
                            optionData
                                .filter((option) => option.QuestionID === question.ID)
                                .filter((option) => option.IsCorrect)
                                .map((option) => option.ID)
                        )}
                    </div>
                    <div className="result-points">Points scored: {response.IsCorrect && (question.Points)}{!response.IsCorrect && (0)}/{question.Points}</div>
                </div>
            );
        });
    };
    return (
        <animated.div className={`result-container ${testData.Title}`} style={fadeIn}>
            <div className="result-start-test-container">
                <div className="result-category-page">
                    <h2>{testData.Title} - Results</h2>
                    <img
                        src={`data:image/png;base64,${testData.ImageBase64}`}
                        alt={`Test: ${testData.Title}`}
                        width={"150"}
                        className="result-category-image"
                    />
                </div>
                <div className="result-score-container">
                    {passed ? (
                        <div>
                            <strong className="result-passed">Passed!</strong>
                        </div>
                    ) : (
                        <div>
                            <strong className="result-failed">Failed!</strong>
                        </div>
                    )}
                    <div>
                        <strong>Score:</strong> {score}
                    </div>
                    <div>
                        <strong>Max Score:</strong> {maxScore}
                    </div>
                    <div>
                        <strong>Percentage:</strong> {percentage}%
                    </div>
                </div>
                {renderQuestions()}
                <button
                    type="button"
                    className={`result-button result-back-to-home-button`}
                    onClick={handleBackToHome}
                >
                    Done
                </button>
            </div>
        </animated.div>
    );
}

export default TestResultsPage;
