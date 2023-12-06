import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import './AddOptionPage.css';

function AddOptionPage() {
  const [option, setOption] = useState({
    QuestionID: '',
    OptionText: '',
    IsCorrect: false
  });

  const [questions, setQuestions] = useState([]);
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8080/questions/get');
        if (response.ok) {
          const questionsData = await response.json();
          setQuestions(questionsData);
        } else {
          console.error('Failed to fetch questions');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchQuestions();
    setTimeout(() => {
      setComponentVisible(true);
    }, 100);
  }, []);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setOption({ ...option, [name]: checked });
    } else if (name === 'QuestionID') {
      const questionID = parseInt(value, 10);
      if (!isNaN(questionID)) {
        setOption({ ...option, [name]: questionID });
      } else {
        setOption({ ...option, [name]: value });
      }
    } else {
      setOption({ ...option, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!option.QuestionID || !option.OptionText) {
      setErrorMessage('Please fill in all the required fields.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/option/post', {
        method: 'POST',
        body: JSON.stringify(option),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccessMessage('Option added successfully!');
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to add option. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('');
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <animated.div style={fadeIn}>
      {questions ? <form className="add-option-form" onSubmit={handleSubmit}>
        <h2 className="add-option-headline">Add an Option</h2>
        <label className="add-option-label">
          Question:
          <select name="QuestionID" value={option.QuestionID} onChange={handleInputChange} className="add-option-select">
            <option value="">Select a Question</option>
            {questions.map((q) => (
              <option key={q.ID} value={q.ID}>
                {q.QuestionText}
              </option>
            ))}
          </select>
        </label>
        <label className="add-option-label">
          Option Text:
          <input type="text" name="OptionText" value={option.OptionText} onChange={handleInputChange} className="add-option-input" />
        </label>
        <label className="add-option-label">
          Is Correct:
          <input type="checkbox" name="IsCorrect" value={option.IsCorrect} onChange={handleInputChange} className="add-option-input" />
        </label>
        <button type="submit" className="add-option-button">Upload Option</button>
      </form> : <div>
        To add options, add a question first.
        </div>}
      {errorMessage && (
        <div className="error-message-option">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="success-message-option">{successMessage}</div>
      )}
    </animated.div>
  );
}

export default AddOptionPage;