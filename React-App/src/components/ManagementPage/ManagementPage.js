import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import './ManagementPage.css';

function ManagementPage() {
  const [question, setQuestion] = useState({
    QuestionText: '',
    Points: '',
    MultipleSelect: false,
    ImageBase64: '',
  });

  const [option, setOption] = useState({
    QuestionID: '',
    OptionText: '',
    IsCorrect: false
  });

  const [test, setTest] = useState({
    Title: '',
    Description: '',
    Category: '',
    Duration: 0,
    Questions: [],
    ImageBase64: '',
  });

  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');
  const [questionSuccessMessage, setQuestionSuccessMessage] = useState('');

  const [optionErrorMessage, setOptionErrorMessage] = useState('');
  const [optionSuccessMessage, setOptionSuccessMessage] = useState('');

  const [testErrorMessage, setTestErrorMessage] = useState('');
  const [testSuccessMessage, setTestSuccessMessage] = useState('');

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

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

  const fetchTests = async () => {
    try {
      const response = await fetch("http://localhost:8080/tests/get");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTests();
    setTimeout(() => {
      setComponentVisible(true);
    }, 100);
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

  const handleInputChangeQuestion = (e) => {
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

  const handleInputChangeOption = (e) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Duration') {
      const duration = parseInt(value, 10);
      setTest({ ...test, [name]: duration });
    } else {
      setTest({ ...test, [name]: value });
    }
  };

  const handleFileInputChangeQuestion = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result.split(',')[1];
      setQuestion({ ...question, ImageBase64: base64Image });
    };

    reader.readAsDataURL(file);
    setQuestion({ ...question, ImageName: file.name });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result.split(',')[1];
      setTest({ ...test, ImageBase64: base64Image });
    };

    reader.readAsDataURL(file);
    setTest({ ...test, ImageName: file.name });
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!question.QuestionText || !(question.Points > 0)) {
      setQuestionSuccessMessage('');
      setQuestionErrorMessage('Please fill in all the required fields.');
      setTimeout(() => {
        setQuestionErrorMessage('');
      }, 3500);
      return;
    }

    try {
      const updatedQuestion = { ...question };

      const response = await fetch('http://localhost:8080/question/post', {
        method: 'POST',
        body: JSON.stringify(updatedQuestion),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchQuestions();
        setQuestionErrorMessage('');
        setQuestionSuccessMessage('Question added successfully!');
        setTimeout(() => {
          setQuestionSuccessMessage('');
        }, 3500);
      } else {
        setQuestionSuccessMessage('');
        setQuestionErrorMessage('Failed to add question. Please try again.');
        setTimeout(() => {
          setQuestionErrorMessage('');
        }, 3500);
      }
    } catch (error) {
      console.error('Error:', error);
      setQuestionSuccessMessage('');
      setQuestionErrorMessage('An error occurred. Please try again.');
      setTimeout(() => {
        setQuestionErrorMessage('');
      }, 3500);
    }
  };

  const handleSubmitOption = async (e) => {
    e.preventDefault();

    if (!option.QuestionID || !option.OptionText) {
      setOptionErrorMessage('Please fill in all the required fields.');
      setTimeout(() => {
        setOptionErrorMessage('');
      }, 3500);
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
        setOptionErrorMessage('');
        setOptionSuccessMessage('Option added successfully!');
        setTimeout(() => {
          setOptionSuccessMessage('');
        }, 3500);
      } else {
        setOptionSuccessMessage('');
        setOptionErrorMessage('Failed to add option. Please try again.');
        setTimeout(() => {
          setOptionErrorMessage('');
        }, 3500);
      }
    } catch (error) {
      console.error('Error:', error);
      setOptionSuccessMessage('');
      setOptionErrorMessage('An error occurred. Please try again.');
      setTimeout(() => {
        setOptionErrorMessage('');
      }, 3500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!test.Title || !test.Description || !test.Category || !(test.Duration > 0) || test.Questions.length === 0) {
      setTestErrorMessage('Please fill in all the required fields.');
      setTimeout(() => {
        setTestErrorMessage('');
      }, 3500);
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
        fetchTests();
        setTestErrorMessage('');
        setTestSuccessMessage('Test added successfully!');
        setTimeout(() => {
          setTestSuccessMessage('');
        }, 3500);
      } else {
        setTestSuccessMessage('');
        setTestErrorMessage('Failed to add test. Please try again.');
        setTimeout(() => {
          setTestErrorMessage('');
        }, 3500);
      }
    } catch (error) {
      console.error('Error:', error);
      setTestSuccessMessage('');
      setTestErrorMessage('An error occurred. Please try again.');
      setTimeout(() => {
        setTestErrorMessage('');
      }, 3500);
    }
  };

  const handleDeleteConfirmation = (test) => {
    setDeleteConfirmation(test);
  };

  const handleDeleteTest = async () => {
    try {
      const response = await fetch('http://localhost:8080/test/updatevisibility', {
        method: 'POST',
        body: JSON.stringify({ TestID: deleteConfirmation.ID, IsVisible: false }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDeleteConfirmation(null);
        fetchTests();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleTestRestore = async (test) => {
    try {
      const response = await fetch('http://localhost:8080/test/updatevisibility', {
        method: 'POST',
        body: JSON.stringify({ TestID: test.ID, IsVisible: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchTests();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <animated.div style={fadeIn}>
      <div className="page-container">
        <div className="left-container">
          <div className="form-container-add">
            <form className="add-form">
              <h2 className="add-headline">Add a Question</h2>
              <label className="add-label">
                Question Text:
                <input type="text" name="QuestionText" value={question.QuestionText} onChange={handleInputChangeQuestion} className="add-input" />
              </label>
              <label className="add-label">
                Points:
                <input type="number" name="Points" value={question.Points} onChange={handleInputChangeQuestion} className="add-input" />
              </label>
              <label className="add-label">
                Multiple Select:
                <input type="checkbox" name="MultipleSelect" value={question.MultipleSelect} onChange={handleInputChangeQuestion} className="add-input" />
              </label>
              <label className="add-label">
                Image:
                <input type="file" name="ImageBase64" onChange={handleFileInputChangeQuestion} className="add-input" />
              </label>
              <button onClick={handleSubmitQuestion} className="add-button">Upload Question</button>
            </form>
            {questionErrorMessage && (
              <div className="option-warning-container">
                <div className="option-warning">
                  <h5>{questionErrorMessage}</h5>
                </div>
              </div>
            )}
            {questionSuccessMessage && (
              <div className="option-success-container">
                <div className="option-success">
                  <h5>{questionSuccessMessage}</h5>
                </div>
              </div>
            )}
          </div>
          <div className="form-container-add">
            {questions ? <form className="add-form">
              <h2 className="add-headline">Add an Option</h2>
              <label className="add-label">
                Question:
                <select name="QuestionID" value={option.QuestionID} onChange={handleInputChangeOption} className="add-select">
                  <option value="">Select a Question</option>
                  {questions.map((q) => (
                    <option key={q.ID} value={q.ID} className='option-from-list' title={q.QuestionText}>
                      {q.QuestionText.length > 50 ? `${q.QuestionText.substring(0, 50)}...` : q.QuestionText}
                    </option>
                  ))}
                </select>
              </label>
              <label className="add-label">
                Option Text:
                <input type="text" name="OptionText" value={option.OptionText} onChange={handleInputChangeOption} className="add-input" />
              </label>
              <label className="add-label">
                Is Correct:
                <input type="checkbox" name="IsCorrect" value={option.IsCorrect} onChange={handleInputChangeOption} className="add-input" />
              </label>
              <button onClick={handleSubmitOption} className="add-button">Upload Option</button>
            </form> : <div>
              To add options, add a question first.
            </div>}
            {optionErrorMessage && (
              <div className="option-warning-container">
                <div className="option-warning">
                  <h5>{optionErrorMessage}</h5>
                </div>
              </div>
            )}
            {optionSuccessMessage && (
              <div className="option-success-container">
                <div className="option-success">
                  <h5>{optionSuccessMessage}</h5>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="middle-container">
          <div className="form-container-add">
            {questions ? (<form className="add-form" onSubmit={handleSubmit}>
              <h2 className="add-headline">Add a Test</h2>
              <label className="add-label">
                Title:
                <input type="text" name="Title" value={test.Title} onChange={handleInputChange} className="add-input" />
              </label>
              <label className="add-label">
                Description:
                <input type="text" name="Description" value={test.Description} onChange={handleInputChange} className="add-input" />
              </label>
              <label className="add-label">
                Category:
                <input type="text" name="Category" value={test.Category} onChange={handleInputChange} className="add-input" />
              </label>
              <label className="add-label">
                Duration:
                <input type="number" name="Duration" value={test.Duration} onChange={handleInputChange} className="add-input" />
              </label>
              <label className="add-label">
                Questions:
                <div className="questions-dropdown-container">
                  <select
                    multiple
                    value={test.Questions}
                    onChange={() => { }}
                    className="add-input"
                  >
                    {questions.map((q) => (
                      <option key={q.ID} value={q.ID} onClick={() => toggleQuestionSelection(q.ID)}>
                        {q.QuestionText}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="add-label">
                Image:
                <input type="file" name="ImageBase64" onChange={handleFileInputChange} className="add-input" />
              </label>
              <button type="submit" className="add-button">Upload Test</button>
            </form>) : <div>
              To add a test, add some questions first.
            </div>}
            {testErrorMessage && (
              <div className="option-warning-container">
                <div className="option-warning">
                  <h5>{testErrorMessage}</h5>
                </div>
              </div>
            )}
            {testSuccessMessage && (
              <div className="option-success-container">
                <div className="option-success">
                  <h5>{testSuccessMessage}</h5>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="right-container">
          <div className="add-form">
            <div className="scrollbar">
              <h2>Delete/Restore Tests</h2>
              {tests.map((test, index) => (
                <div key={index}
                  style={{ textDecoration: "none", color: "white" }}>
                  <div className="manage-test">
                    <img src={`data:image/png;base64, ${test.ImageBase64}`} alt="No image" />
                    <div className="manage-test-details">
                      {(deleteConfirmation && deleteConfirmation.ID === test.ID) || !test.IsVisible ? null : (
                        <>
                          <p><strong>Test:</strong> {test.Title}</p>
                          <p><strong>Description:</strong> {test.Category}</p>
                          {test.IsVisible ? (<p><strong>Deleted: </strong>No</p>) : (<p><strong>Deleted: </strong>Yes</p>)}
                        </>
                      )}
                      {test.IsVisible && !deleteConfirmation && !test.RestoreConfirmation && (
                        <button className='restore-delete-button delete' onClick={() => handleDeleteConfirmation(test)}>Delete</button>
                      )}
                      {test.IsVisible && deleteConfirmation && deleteConfirmation.ID === test.ID && (
                        <div className="delete-confirmation">
                          <p>Are you sure you want to delete this test?</p>
                          <button className='yes-button' onClick={handleDeleteTest}>Yes</button>
                          <button className='no-button' onClick={handleCancelDelete}>No</button>
                        </div>
                      )}
                      {!test.IsVisible && !test.RestoreConfirmation && (
                        <>
                          <p><strong>Test:</strong> {test.Title}</p>
                          <p><strong>Description:</strong> {test.Category}</p>
                          <p><strong>Deleted: </strong>Yes</p>
                          <button className='restore-delete-button' onClick={() => handleTestRestore(test)}>Restore</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}

export default ManagementPage;