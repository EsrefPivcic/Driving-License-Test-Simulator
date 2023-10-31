/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:8080/students/get')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>Your React App</h1>
            <ul>
                {data.map(item => (
                    <li key={item.ID}>
                        <strong>ID:</strong> {item.ID}<br />
                        <strong>Name:</strong> {item.Name}<br />
                        <strong>Surname:</strong> {item.Surname}<br />
                        <strong>Username:</strong> {item.Username}<br />
                        <strong>Email:</strong> {item.Email}<br />
                        <strong>Password:</strong> {item.Password}<br />
                        <br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
*/

/*import React, { useState } from 'react';

function TestUploadForm() {
  const [test, setTest] = useState({
    Title: '',
    Description: '',
    Questions: [],
    Category: '',
    ImageBase64: '',
    Duration: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Duration') {
      const duration = parseInt(value, 10);
      setTest({ ...test, [name]: duration });
    } else if (name === 'Questions') {
      const questionsArray = value.split(',').map((str) => parseInt(str.trim(), 10));
      setTest({ ...test, [name]: questionsArray });
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
      const response = await fetch('http://localhost:8080/test/post', {
        method: 'POST',
        body: JSON.stringify(test),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
      } else {
      }
    } catch (error) {
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="Title" value={test.Title} onChange={handleInputChange} />
      </label>
      <label>
        Description:
        <input type="text" name="Description" value={test.Description} onChange={handleInputChange} />
      </label>
      <label>
        Category:
        <input type="text" name="Category" value={test.Category} onChange={handleInputChange} />
      </label>
      <label>
        Duration:
        <input type="number" name="Duration" value={test.Duration} onChange={handleInputChange} />
      </label>
      <label>
        Questions (comma-separated):
        <textarea name="Questions" value={test.Questions} onChange={handleInputChange} />
      </label>
      <label>
        Image:
        <input type="file" name="ImageBase64" onChange={handleImageUpload} />
      </label>
      <button type="submit">Upload Test</button>
    </form>
  );
}

export default TestUploadForm;
*/

import React, { useState, useEffect } from "react";

function TestButton() {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    fetchTestData();
  }, []);

  const razmakni = {
    margin: '20px',
    padding: '20px'
  };

  const fetchTestData = async () => {
    try {
      const response = await fetch("http://localhost:8080/tests/get");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTestData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Test Data</h2>
      <table>
        <thead>
          <tr>
            <th style={razmakni}>Title</th>
            <th style={razmakni}>Description</th>
            <th style={razmakni}>Image</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((test) => (
            <tr key={test.ID}>
              <td style={razmakni}>{test.Title}</td>
              <td style={razmakni}>{test.Description}</td>
              <td style={razmakni}>
                {test.ImageBase64 && (
                  <img src={`data:image/png;base64,${test.ImageBase64}`} alt={`Test: ${test.Title}`} width="150" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestButton;

