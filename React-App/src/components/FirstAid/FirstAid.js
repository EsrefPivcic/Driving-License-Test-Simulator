import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import './FirstAid.css';

function FirstAid({ category, categoryData }) {
  const navigate = useNavigate();

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

  useEffect(() => {
    setComponentVisible(true);
  }, []);

  const buttonStyle = 'button';
  const nextButtonStyle = `${buttonStyle} next-button`;
  const submitButtonStyle = `${buttonStyle} submit-button`;
  const backButtonStyle = `${buttonStyle} back-button`;

  const { headline, description, photo } = categoryData[category];
  const { questions } = categoryData[category];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [questionCount, setQuestionCount] = useState(0);

  const handleAnswerChange = (index, selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[index] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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
    navigate('/');
  };

  const handleBackToPreviousContent = () => {
    setTestStarted(false);
  };

  const handleSubmission = () => {
    console.log('Answers submitted:', answers);
  };

  const isCategoryA = category === 'a';

  return (
    <animated.div className={`container ${isCategoryA ? 'category-a' : ''}`} style={fadeIn}>
      {!testStarted ? (
        <div className="start-test-container">
          <div className="category-page">
            <h2>{headline}</h2>
            <img src={photo} alt={headline} />
            <p><strong>{description}</strong></p>
            <p>The First Aid exam consists of 10 questions. Each question has 1 correct answer.</p>
            <p>The required passing score is 9, or 90%.</p>
          </div>
          <button type="button" className={`button back-to-home-button`} onClick={handleBackToHome}>
            Quit
          </button>
          <button type="button" className={`button start-test-button`} onClick={handleStartTest}>
            Start
          </button>
        </div>
      ) : (
        <animated.div style={questionAnimation}>
          <h2>{categoryData[category].headline} Test</h2>
          <p>Question {questionCount} of {questions.length}</p>
          <div className="form-container">
            <form>
              <div
                key={currentQuestion}
                className="question-container"
                style={{ marginBottom: '20px' }}
              >
                <p>{questions[currentQuestion].question}</p>
                <div>
                  {questions[currentQuestion].answers.map((answer, answerIndex) => (
                    <label key={answerIndex} style={{ display: 'block', marginBottom: '10px' }}>
                      <input
                        type="radio"
                        name={`question_${currentQuestion}`}
                        value={answer}
                        checked={answers[currentQuestion] === answer}
                        onChange={() => handleAnswerChange(currentQuestion, answer)}
                      />
                      {answer}
                    </label>
                  ))}
                </div>
              </div>
              <div className="button-container">
                {currentQuestion === 0 && (
                  <button
                    type="button"
                    className={`button back-to-previous-content-button`}
                    onClick={handleBackToPreviousContent}
                  >
                    Quit
                  </button>
                )}
                {currentQuestion > 0 && (
                  <button type="button" className={backButtonStyle} onClick={handleBackQuestion}>
                    Back
                  </button>
                )}
                {currentQuestion < questions.length - 1 ? (
                  <button type="button" className={nextButtonStyle} onClick={handleNextQuestion}>
                    Next
                  </button>
                ) : (
                  <button type="button" className={submitButtonStyle} onClick={handleSubmission}>
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </animated.div>
      )}
    </animated.div>
  );
}

export default FirstAid;