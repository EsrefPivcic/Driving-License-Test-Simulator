import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import "./TestPage.css";

function TestPage({ test, testData }) {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const questionAnimation = useSpring({
    opacity: testStarted ? 1 : 0,
    from: { opacity: 0 },
  });

  const [questionData, setQuestionData] = useState([]);
  const [optionData, setOptionData] = useState([]);

  const fetchQuestionData = async () => {
    try {
      const response = await fetch("http://localhost:8080/questions/getbyids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Questions }),
      });

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
          body: JSON.stringify({ Questions }),
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

  useEffect(() => {
    setComponentVisible(true);
    fetchQuestionData();
    fetchOptionData();
  }, []);

  const buttonStyle = "button";
  const nextButtonStyle = `${buttonStyle} next-button`;
  const submitButtonStyle = `${buttonStyle} submit-button`;
  const backButtonStyle = `${buttonStyle} back-button`;

  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const { Title, Description, ImageBase64, Category, Duration } = testData[test];
  const { Questions } = testData[test];

  const handleOptionChange = (questionId, optionId) => {
    const isMultipleSelect = questionData[currentQuestion].MultipleSelect;
    if (isMultipleSelect) {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [questionId]: [...(prevSelectedOptions[questionId] || []), optionId],
      }));
    } else {
      setSelectedOptions((prevSelectedOptions) => {
        return {
          ...prevSelectedOptions,
          [questionId]: [optionId],
        };
      });
    }
  };

  const handleOptionRemove = (questionId, optionId) => {
    setSelectedOptions((prevSelectedOptions) => {
      const options = prevSelectedOptions[questionId] || [];
      const updatedOptions = options.filter((id) => id !== optionId);
      return {
        ...prevSelectedOptions,
        [questionId]: updatedOptions,
      };
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionCount(questionCount + 1);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setQuestionCount(questionCount - 1);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
    setQuestionCount(1);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleBackToPreviousContent = () => {
    setTestStarted(false);
  };

  const handleSubmission = () => {
    const studentresponses = Object.entries(selectedOptions).map(
      ([questionId, selectedOptionIds]) => [questionId, selectedOptionIds]
    );
    const hasEmptySelection = Object.values(selectedOptions).some(
      (selectedOptionIds) => selectedOptionIds.length === 0
    );
    if (hasEmptySelection) {
      setShowWarning(true);
      setShowSuccess(false);
    } else {
      if (studentresponses.length < Questions.length) {
        setShowWarning(true);
        setShowSuccess(false);
      }
      else {
        setShowWarning(false);
        setShowSuccess(true);
        console.log("Answers submitted:", studentresponses);
      }
    }
  };

  const getOptionsForCurrentQuestion = () => {
    const currentQuestionID = questionData[currentQuestion].ID;
    return optionData.filter(
      (option) => option.QuestionID === currentQuestionID
    );
  };

  return (
    <animated.div className={`container ${Title}`} style={fadeIn}>
      {!testStarted ? (
        <div className="start-test-container">
          <div className="category-page">
            <h2>{Title}</h2>
            <img
              src={`data:image/png;base64,${ImageBase64}`}
              alt={`Test: ${Title}`}
              width={"150"}
              className="category-image"
            />
            <p><strong>{Description}</strong></p>
            <p>The exam for Category {Category} consists of {Questions.length}{" "} questions.</p>
            <p>You have {Duration} minutes to finish the exam.</p>
            <p>The required passing score is 108, with a maximum score of 120.</p>
          </div>
          <button type="button" className={`button back-to-home-button`} onClick={handleBackToHome}>Quit</button>
          <button type="button" className={`button start-test-button`} onClick={handleStartTest}>Start</button>
        </div>
      ) : (
        <animated.div style={questionAnimation}>
          <h2>{testData[test].Title} Test</h2>
          <p>Question {questionCount} of {Questions.length}</p>
          <div className="form-container">
            <form>
              <div key={currentQuestion} className="question-container" style={{ marginBottom: "20px" }}>
                <p>{questionData[currentQuestion].QuestionText}</p>
                {questionData[currentQuestion].ImageBase64 && (
                  <img
                    src={`data:image/png;base64,${questionData[currentQuestion].ImageBase64}`}
                    alt={`Test: ${questionData[currentQuestion].QuestionText}`}
                    className="category-image"
                  />
                )}
                <div>
                  {getOptionsForCurrentQuestion().map((option, optionIndex) => (
                    <label key={optionIndex} style={{ display: "block", marginBottom: "10px" }}>
                      <input
                        type={questionData[currentQuestion].MultipleSelectb ? "checkbox" : "radio"}
                        name={`question_${questionData[currentQuestion].ID}`} 
                        value={option.ID}
                        checked={selectedOptions[questionData[currentQuestion].ID]?.includes(option.ID) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleOptionChange(questionData[currentQuestion].ID, option.ID);
                          } else {
                            handleOptionRemove(questionData[currentQuestion].ID, option.ID);
                          }
                        }}
                      />
                      {option.OptionText}
                    </label>
                  ))}
                </div>
              </div>
              <div className="button-container">
                {currentQuestion === 0 && (
                  <button type="button" className={`button back-to-previous-content-button`} onClick={handleBackToPreviousContent}>Quit</button>
                )}
                {currentQuestion > 0 && (
                  <button type="button" className={backButtonStyle} onClick={handleBackQuestion}>Back</button>
                )}
                {currentQuestion < Questions.length - 1 ? (
                  <button type="button" className={nextButtonStyle} onClick={handleNextQuestion}>Next</button>
                ) : (
                  <button type="button" className={submitButtonStyle} onClick={handleSubmission}>Submit</button>
                )}
              </div>
            </form>
          </div>
        </animated.div>
      )}
      {showWarning && (
        <div className="submitwarning">
          <h5>Please select at least one answer for each question before submitting.</h5>
        </div>
      )}
      {showSuccess && (
        <div className="submitsuccess">
          <h5>Answers submitted successfully!</h5>
        </div>
      )}
    </animated.div>
  );
}

export default TestPage;