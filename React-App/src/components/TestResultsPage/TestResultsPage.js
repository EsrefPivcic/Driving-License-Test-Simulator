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
    const [userResponsesData, setUserResponsesData] = useState([]);
    const [optionData, setOptionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterOption, setFilterOption] = useState("all");

    const handleFilterOption = (option) => {
        setFilterOption(option);
    };

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

    const fetchQuestionsData = async () => {
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

    const fetchOptionsData = async () => {
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

    const fetchUserResponsesData = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/userresponses/getbyattemptid",
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
            setUserResponsesData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    const handleToExamHistory = () => {
        navigate("/examhistory");
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchTestData();
            await fetchUserResponsesData();
            setIsLoading(false);
        };

        fetchData();
    }, [attempt]);

    useEffect(() => {
        if (testData.Questions) {
            fetchQuestionsData();
            fetchOptionsData();
            setTimeout(() => {
                setComponentVisible(true);
            }, 100);
        }
    }, [testData]);

    const passed = attempt.Passed;
    const score = attempt.Score;
    const maxScore = attempt.MaxScore;
    const percentage = attempt.Percentage;

    const renderQuestions = () => {
        const filteredQuestionsData = questionData.filter((question) => {
            const response = userResponsesData
                ? userResponsesData.find((r) => r.QuestionID === question.ID)
                : null;

            if (filterOption === "correct" && response && response.IsCorrect) {
                return true;
            }

            if (filterOption === "incorrect" && (!response || !response.IsCorrect)) {
                return true;
            }

            if (filterOption === "all") {
                return true;
            }

            return false;
        });

        return filteredQuestionsData.map((question) => {
            const response = userResponsesData
                ? userResponsesData.find((r) => r.QuestionID === question.ID)
                : null;

            const selectedOptions = response ? response.SelectedOptions : [];

            return (
                <div key={question.ID} className="result-question-container">
                    <div className="result-question-text">
                        {question.QuestionText}
                        {question.ImageBase64 && (<div>
                            <img
                                src={`data:image/png;base64,${question.ImageBase64}`}
                                alt={`Test: ${question.QuestionText}`}
                                className="response-image" />
                        </div>)}
                    </div>
                    <div className="result-options-container">
                        {optionData
                            .filter((option) => option.QuestionID === question.ID)
                            .map((option) => (
                                <div
                                    key={option.ID}
                                    className={`result-option ${selectedOptions.includes(option.ID)
                                        ? option.IsCorrect
                                            ? "result-selected-correct"
                                            : "result-selected-incorrect"
                                        : option.IsCorrect
                                            ? "result-not-selected-correct"
                                            : "result-not-selected-incorrect"
                                        }`}
                                >
                                    {option.OptionText}
                                </div>
                            ))}
                    </div>
                    <div className="result-points">
                        Points scored: {response ? (response.IsCorrect ? question.Points : 0) : 0}/{question.Points}
                    </div>
                </div>
            );
        });
    };


    if (isLoading) {
        return <animated.div className="loading-results" style={fadeIn}>Loading...</animated.div>
    }
    else {
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
                        <div className="toggle-container">
                            <button
                                className={`filter-button ${filterOption === "all" && "active"}`}
                                onClick={() => handleFilterOption("all")}
                            >
                                All
                            </button>
                            <button
                                className={`filter-button ${filterOption === "correct" && "active"}`}
                                onClick={() => handleFilterOption("correct")}
                            >
                                Correct
                            </button>
                            <button
                                className={`filter-button ${filterOption === "incorrect" && "active"}`}
                                onClick={() => handleFilterOption("incorrect")}
                            >
                                Incorrect
                            </button>
                        </div>
                    </div>
                    {renderQuestions()}
                    <div className="button-container-results"><button
                        type="button"
                        className={`home-history-button history-button`}
                        onClick={handleToExamHistory}
                    >
                        Exam History
                    </button>
                        <button
                            type="button"
                            className={`home-history-button home-button`}
                            onClick={handleBackToHome}
                        >
                            Home
                        </button>
                    </div>
                </div>
            </animated.div>
        );
    }
}

export default TestResultsPage;
