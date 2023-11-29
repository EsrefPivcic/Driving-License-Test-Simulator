import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import './AddTestPage.css';

function AddTestPage() {
  const [test, setTest] = useState({
    Title: '',
    Description: '',
    Category: '',
    Duration: 0,
    Questions: [],
    ImageBase64: '',
  });

  const [questions, setQuestions] = useState([]);
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

    setComponentVisible(true);
  }, []);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const toggleQuestionSelection = (questionId) => {
    const selectedQuestions = test.Questions.includes(questionId)
      ? test.Questions.filter((id) => id !== questionId)
      : [...test.Questions, questionId];

    setTest({
      ...test,
      Questions: selectedQuestions,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Duration') {
      const duration = parseInt(value, 10);
      setTest({ ...test, [name]: duration });
    } else {
      setTest({ ...test, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result.split(',')[1];
      setTest({ ...test, ImageBase64: base64Image });
    };

    reader.readAsDataURL(file);
    setTest({ ...test, ImageName: file.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!test.Title || !test.Description || !test.Category || !(test.Duration > 0) || test.Questions.length === 0) {
      setErrorMessage('Please fill in all the required fields.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/test/post', {
        method: 'POST',
        body: JSON.stringify(test),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccessMessage('Test added successfully!');
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to add test. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('');
      setErrorMessage('An error occurred. Please try again.');
    }
  };


  return (
    <animated.div style={fadeIn}>
      <form className="add-test-form" onSubmit={handleSubmit}>
        <h2 className="add-test-headline">Add a Test</h2>
        <label className="add-test-label">
          Title:
          <input type="text" name="Title" value={test.Title} onChange={handleInputChange} className="add-test-input" />
        </label>
        <label className="add-test-label">
          Description:
          <input type="text" name="Description" value={test.Description} onChange={handleInputChange} className="add-test-input" />
        </label>
        <label className="add-test-label">
          Category:
          <input type="text" name="Category" value={test.Category} onChange={handleInputChange} className="add-test-input" />
        </label>
        <label className="add-test-label">
          Duration:
          <input type="number" name="Duration" value={test.Duration} onChange={handleInputChange} className="add-test-input" />
        </label>
        <label className="add-test-label">
          Questions:
          <div className="questions-dropdown-container">
            <select
              multiple
              value={test.Questions}
              onChange={() => {}}
              className="add-test-input"
            >
              {questions.map((q) => (
                <option
                  key={q.ID}
                  value={q.ID}
                  onClick={() => toggleQuestionSelection(q.ID)}
                >
                  <div><input
                    type="checkbox"
                    checked={test.Questions.includes(q.ID)}
                    readOnly
                  /></div>
                  {q.QuestionText}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="add-test-label">
          Image:
          <input type="file" name="ImageBase64" onChange={handleImageUpload} className="add-test-input" />
        </label>
        <button type="submit" className="add-test-button">Upload Test</button>
      </form>
      {errorMessage && (
        <div className="error-message-test">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="success-message-test">{successMessage}</div>
      )}
    </animated.div>
  );
}

export default AddTestPage;