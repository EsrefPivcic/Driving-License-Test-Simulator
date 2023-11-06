import React, { useState } from 'react';
import './AddQuestionPage.css';

function AddTestPage() {
  const [test, setTest] = useState({
    QuestionText: '',
    Points: '',
    MultipleSelect: false,
    ImageBase64: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setTest({ ...test, [name]: checked });
    } else if (name === 'Points') {
      const points = parseInt(value, 10);
      setTest({ ...test, [name]: points });
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

    try {
      const updatedTest = { ...test};
        
      const response = await fetch('http://localhost:8080/question/post', {
        method: 'POST',
        body: JSON.stringify(updatedTest),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Handle success
      } else {
        // Handle failure
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="add-test-form" onSubmit={handleSubmit}>
      <label className="add-test-label">
        Question Text:
        <input type="text" name="QuestionText" value={test.QuestionText} onChange={handleInputChange} className="add-test-input" />
      </label>
      <label className="add-test-label">
        Points:
        <input type="number" name="Points" value={test.Points} onChange={handleInputChange} className="add-test-input" />
      </label>
      <label className="add-test-label">
        Multiple Select:
        <input type="checkbox" name="MultipleSelect" value={test.MultipleSelect} onChange={handleInputChange} className="add-test-input" />
      </label>
      <label className="add-test-label">
        Image:
        <input type="file" name="ImageBase64" onChange={handleImageUpload} className="add-test-input" />
      </label>
      <button type="submit" className="add-test-button">Upload Question</button>
    </form>
  );
}

export default AddTestPage;