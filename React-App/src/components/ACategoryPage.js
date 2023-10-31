import React, { useState } from 'react';

function ACategoryPage({ category, categoryData }) {
  const formContainerStyle = {
    maxWidth: '600px',
    height: '300px',
    margin: '0 auto',
    padding: '20px',
    border: '2px solid #61dafb',
    borderRadius: '10px',
    marginTop: '7%',
  };

  const buttonStyle = {
    padding: '15px',
    margin: '20px 10px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    width: '100px',
    height: '50px',
  };

  const nextButtonStyle = {
    ...buttonStyle,
    background: '#4285f4',
    color: '#fff',
  };

  const submitButtonStyle = {
    ...buttonStyle,
    background: '#4CAF50',
    color: '#fff',
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: '#f44336',
    color: '#fff',
  };

  const { questions } = categoryData[category];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleAnswerChange = (index, selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[index] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmission = () => {
    // Handle submission logic here
    console.log('Answers submitted:', answers);
    // You can redirect to a results page or perform other actions after submission.
  };

  const isCategoryA = category === 'a';

  const containerStyle = {
    marginBottom: '20px',
    fontSize: '20px',
    ...(isCategoryA),
  };

  return (
    <div style={containerStyle}>
      <h2>{categoryData[category].headline} Test</h2>
      <div style={formContainerStyle}>
        <form>
          <div key={currentQuestion} style={{ marginBottom: '20px' }}>
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
          <div>
            {currentQuestion > 0 && (
              <button type="button" style={backButtonStyle} onClick={handleBackQuestion}>
                Back
              </button>
            )}
            {currentQuestion < questions.length - 1 ? (
              <button type="button" style={nextButtonStyle} onClick={handleNextQuestion}>
                Next
              </button>
            ) : (
              <button type="button" style={submitButtonStyle} onClick={handleSubmission}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ACategoryPage;
