import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import './AddQuestionPage.css';

function AddQuestionPage() {
  const [question, setQuestion] = useState({
    QuestionText: '',
    Points: '',
    MultipleSelect: false,
    ImageBase64: '',
  });

  const [isComponentVisible, setComponentVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setComponentVisible(true);
  }, []);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setQuestion({ ...question, [name]: checked });
    } else if (name === 'Points') {
      const points = parseInt(value, 10);
      setQuestion({ ...question, [name]: points });
    } else {
      setQuestion({ ...question, [name]: value });
    }
  };  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result.split(',')[1];
      setQuestion({ ...question, ImageBase64: base64Image });
    };

    reader.readAsDataURL(file);
    setQuestion({ ...question, ImageName: file.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.QuestionText || !(question.Points > 0)) {
      setErrorMessage('Please fill in all the required fields.');
      setSuccessMessage('');
      return;
    }

    try {
      const updatedQuestion = { ...question};
        
      const response = await fetch('http://localhost:8080/question/post', {
        method: 'POST',
        body: JSON.stringify(updatedQuestion),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccessMessage('Question added successfully!');
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to add question. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('');
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <animated.div style={fadeIn}>
    <form className="add-question-form" onSubmit={handleSubmit}>
      <h2 className="add-question-headline">Add a Question</h2>
      <label className="add-question-label">
        Question Text:
        <input type="text" name="QuestionText" value={question.QuestionText} onChange={handleInputChange} className="add-question-input" />
      </label>
      <label className="add-question-label">
        Points:
        <input type="number" name="Points" value={question.Points} onChange={handleInputChange} className="add-question-input" />
      </label>
      <label className="add-question-label">
        Multiple Select:
        <input type="checkbox" name="MultipleSelect" value={question.MultipleSelect} onChange={handleInputChange} className="add-question-input" />
      </label>
      <label className="add-question-label">
        Image:
        <input type="file" name="ImageBase64" onChange={handleImageUpload} className="add-question-input" />
      </label>
      <button type="submit" className="add-question-button">Upload Question</button>
    </form>
    {errorMessage && (
        <div className="error-message-question">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="success-message-question">{successMessage}</div>
      )}
    </animated.div>
  );
}

export default AddQuestionPage;