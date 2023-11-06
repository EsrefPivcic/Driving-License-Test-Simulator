import { useState } from "react";
import { useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AllTestsPage from "./AllTestsPage/AllTestsPage";
import TestPage from "./TestPage/TestPage";
import "./App.css";
import AddTestPage from "./AddTestPage/AddTestPage";
import AddQuestionPage from "./AddQuestionPage/AddQuestionPage";

function App() {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    fetchTestData();
  }, []);

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
    <BrowserRouter>
      <div className="app">
        <div className="app-content">
          <h1 className="app-title">
            <Link to="/">eDrivingSchool</Link>
          </h1>
          <Routes>
            <Route path="addtest" element={<AddTestPage />}></Route>
            <Route path="addquestion" element={<AddQuestionPage />}></Route>
            <Route path="/" element={<AllTestsPage testData={testData} />} />
            {Object.keys(testData).map((test) => (
              <Route
                key={test}
                path={`/${testData[test].Category.toLowerCase()}test`}
                element={
                  testData[test].Category === "A" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "B" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "C" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "D" ? (
                    <TestPage test={test} testData={testData} />
                  ) : testData[test].Category === "T" ? (
                    <TestPage test={test} testData={testData} />
                  ) : (
                    <TestPage test={test} testData={testData} />
                  )
                }
              />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

//DUMP

/*___________STUDENTS-GET_________________________________
import React, { useEffect, useState } from 'react';
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

export default App;*/

//___________TESTS-GET_________________________________________
/*import React, { useState, useEffect } from "react";

function TestButton() {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    fetchTestData();
  }, []);

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

  const razmakni = {
    margin: '20px',
    padding: '20px'
  };

  return (
    <div>
      <h2>Test Data</h2>
      <table>
        <thead>
          <tr>
            <th style={razmakni}>ID</th>
            <th style={razmakni}>Title</th>
            <th style={razmakni}>Description</th>
            <th style={razmakni}>Questions</th>
            <th style={razmakni}>Category</th>
            <th style={razmakni}>Duration</th>
            <th style={razmakni}>Image</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((test) => (
            <tr key={test.ID}>
              <td style={razmakni}>{test.ID}</td>
              <td style={razmakni}>{test.Title}</td>
              <td style={razmakni}>{test.Description}</td>
              <td style={razmakni}>{test.Questions.join(", ")}</td>
              <td style={razmakni}>{test.Category}</td>
              <td style={razmakni}>{test.Duration}</td>
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

export default TestButton;*/
//____________________

//______________CategoryData za svaki slučaj________________
/*const categoryData = {
    a: {
      headline: 'A Category',
      description: 'A and A1 category (motorcycle and moped)',
      photo: process.env.PUBLIC_URL + '/images/motor.png',
      questions: [
        {
          question: 'What should you do when approaching a stop sign?',
          answers: ['Stop completely and then proceed', 
          'Slow down and proceed without stopping', 
          'Ignore it and keep going'],
        },
        {
          question: 'When should you use your motorcycle headlights?',
          answers: [
            'Only at night',
            'During the day to increase visibility',
            'Only in bad weather conditions',
          ],
        },
        {
          question: 'What is the recommended safe following distance behind a vehicle?',
          answers: ['1 second', '2 seconds', '3 seconds'],
        },
        {
          question: 'In heavy traffic, what should you do to increase your visibility?',
          answers: [
            'Stay close to the vehicle in front of you',
            'Ride in the center of the lane',
            'Frequently change lanes',
          ],
        },
        {
          question: 'When should you use your motorcycles horn?',
          answers: [
            'To alert others of your presence in a dangerous situation',
            'To express frustration with other road users',
            'Only in residential areas',
          ],
        },
        {
          question: 'What is the correct hand signal for a right turn?',
          answers: ['Extend your left arm and point right', 
          'Extend your right arm and point right', 
          'Extend your left arm downward'],
        },
        {
          question: 'When is it important to check your mirrors?',
          answers: ['Only when changing lanes', 'Before slowing down or stopping', 'Only in urban areas'],
        },
        {
          question: 'What does it mean when a traffic light is flashing yellow?',
          answers: ['Proceed with caution', 'Stop and wait for a green light', 'Slow down and prepare to stop'],
        },
        {
          question: 'How often should you check your motorcycles tire pressure?',
          answers: ['Once a month', 'Once a year', 'Only when you notice a problem'],
        },
        {
          question: 'What is the most common cause of motorcycle accidents at intersections?',
          answers: [
            'Failure to yield the right of way',
            'Excessive speed',
            'Lack of proper protective gear',
          ],
        },
      ],
    },
    b: {
      headline: 'B Category',
      description: 'B and B1 category (car and moped)',
      photo: process.env.PUBLIC_URL + '/images/taxi.png',
      questions: [
        {
          question: 'What should you do when approaching a stop sign?',
          answers: ['Stop completely and then proceed', 'Slow down and proceed without stopping', 'Ignore it and keep going'],
        },
        {
          question: 'When should you use your motorcycle headlights?',
          answers: [
            'Only at night',
            'During the day to increase visibility',
            'Only in bad weather conditions',
          ],
        },
        {
          question: 'What is the recommended safe following distance behind a vehicle?',
          answers: ['1 second', '2 seconds', '3 seconds'],
        },
        {
          question: 'In heavy traffic, what should you do to increase your visibility?',
          answers: [
            'Stay close to the vehicle in front of you',
            'Ride in the center of the lane',
            'Frequently change lanes',
          ],
        },
        {
          question: 'When should you use your motorcycles horn?',
          answers: [
            'To alert others of your presence in a dangerous situation',
            'To express frustration with other road users',
            'Only in residential areas',
          ],
        },
        {
          question: 'What is the correct hand signal for a right turn?',
          answers: ['Extend your left arm and point right', 'Extend your right arm and point right', 'Extend your left arm downward'],
        },
        {
          question: 'When is it important to check your mirrors?',
          answers: ['Only when changing lanes', 'Before slowing down or stopping', 'Only in urban areas'],
        },
        {
          question: 'What does it mean when a traffic light is flashing yellow?',
          answers: ['Proceed with caution', 'Stop and wait for a green light', 'Slow down and prepare to stop'],
        },
        {
          question: 'How often should you check your motorcycles tire pressure?',
          answers: ['Once a month', 'Once a year', 'Only when you notice a problem'],
        },
        {
          question: 'What is the most common cause of motorcycle accidents at intersections?',
          answers: [
            'Failure to yield the right of way',
            'Excessive speed',
            'Lack of proper protective gear',
          ],
        },
      ],
    },
    c: {
      headline: 'C Category',
      description: 'C and C1 category (truck and truck 7.5t)',
      photo: process.env.PUBLIC_URL + '/images/truck.png',
      questions: [
        {
          question: 'What should you do when approaching a stop sign?',
          answers: ['Stop completely and then proceed', 'Slow down and proceed without stopping', 'Ignore it and keep going'],
        },
        {
          question: 'When should you use your motorcycle headlights?',
          answers: [
            'Only at night',
            'During the day to increase visibility',
            'Only in bad weather conditions',
          ],
        },
        {
          question: 'What is the recommended safe following distance behind a vehicle?',
          answers: ['1 second', '2 seconds', '3 seconds'],
        },
        {
          question: 'In heavy traffic, what should you do to increase your visibility?',
          answers: [
            'Stay close to the vehicle in front of you',
            'Ride in the center of the lane',
            'Frequently change lanes',
          ],
        },
        {
          question: 'When should you use your motorcycles horn?',
          answers: [
            'To alert others of your presence in a dangerous situation',
            'To express frustration with other road users',
            'Only in residential areas',
          ],
        },
        {
          question: 'What is the correct hand signal for a right turn?',
          answers: ['Extend your left arm and point right', 'Extend your right arm and point right', 'Extend your left arm downward'],
        },
        {
          question: 'When is it important to check your mirrors?',
          answers: ['Only when changing lanes', 'Before slowing down or stopping', 'Only in urban areas'],
        },
        {
          question: 'What does it mean when a traffic light is flashing yellow?',
          answers: ['Proceed with caution', 'Stop and wait for a green light', 'Slow down and prepare to stop'],
        },
        {
          question: 'How often should you check your motorcycles tire pressure?',
          answers: ['Once a month', 'Once a year', 'Only when you notice a problem'],
        },
        {
          question: 'What is the most common cause of motorcycle accidents at intersections?',
          answers: [
            'Failure to yield the right of way',
            'Excessive speed',
            'Lack of proper protective gear',
          ],
        },
      ],
    },
    d: {
      headline: 'D Category',
      description: 'D category (bus)',
      photo: process.env.PUBLIC_URL + '/images/bus.png',
      questions: [
        {
          question: 'What should you do when approaching a stop sign?',
          answers: ['Stop completely and then proceed', 'Slow down and proceed without stopping', 'Ignore it and keep going'],
        },
        {
          question: 'When should you use your motorcycle headlights?',
          answers: [
            'Only at night',
            'During the day to increase visibility',
            'Only in bad weather conditions',
          ],
        },
        {
          question: 'What is the recommended safe following distance behind a vehicle?',
          answers: ['1 second', '2 seconds', '3 seconds'],
        },
        {
          question: 'In heavy traffic, what should you do to increase your visibility?',
          answers: [
            'Stay close to the vehicle in front of you',
            'Ride in the center of the lane',
            'Frequently change lanes',
          ],
        },
        {
          question: 'When should you use your motorcycles horn?',
          answers: [
            'To alert others of your presence in a dangerous situation',
            'To express frustration with other road users',
            'Only in residential areas',
          ],
        },
        {
          question: 'What is the correct hand signal for a right turn?',
          answers: ['Extend your left arm and point right', 'Extend your right arm and point right', 'Extend your left arm downward'],
        },
        {
          question: 'When is it important to check your mirrors?',
          answers: ['Only when changing lanes', 'Before slowing down or stopping', 'Only in urban areas'],
        },
        {
          question: 'What does it mean when a traffic light is flashing yellow?',
          answers: ['Proceed with caution', 'Stop and wait for a green light', 'Slow down and prepare to stop'],
        },
        {
          question: 'How often should you check your motorcycles tire pressure?',
          answers: ['Once a month', 'Once a year', 'Only when you notice a problem'],
        },
        {
          question: 'What is the most common cause of motorcycle accidents at intersections?',
          answers: [
            'Failure to yield the right of way',
            'Excessive speed',
            'Lack of proper protective gear',
          ],
        },
      ],
    },
    t: {
      headline: 'T Category',
      description: 'T category (tractor, working machines)',
      photo: process.env.PUBLIC_URL + '/images/tractor.png',
      questions: [
        {
          question: 'What should you do when approaching a stop sign?',
          answers: ['Stop completely and then proceed', 'Slow down and proceed without stopping', 'Ignore it and keep going'],
        },
        {
          question: 'When should you use your motorcycle headlights?',
          answers: [
            'Only at night',
            'During the day to increase visibility',
            'Only in bad weather conditions',
          ],
        },
        {
          question: 'What is the recommended safe following distance behind a vehicle?',
          answers: ['1 second', '2 seconds', '3 seconds'],
        },
        {
          question: 'In heavy traffic, what should you do to increase your visibility?',
          answers: [
            'Stay close to the vehicle in front of you',
            'Ride in the center of the lane',
            'Frequently change lanes',
          ],
        },
        {
          question: 'When should you use your motorcycles horn?',
          answers: [
            'To alert others of your presence in a dangerous situation',
            'To express frustration with other road users',
            'Only in residential areas',
          ],
        },
        {
          question: 'What is the correct hand signal for a right turn?',
          answers: ['Extend your left arm and point right', 'Extend your right arm and point right', 'Extend your left arm downward'],
        },
        {
          question: 'When is it important to check your mirrors?',
          answers: ['Only when changing lanes', 'Before slowing down or stopping', 'Only in urban areas'],
        },
        {
          question: 'What does it mean when a traffic light is flashing yellow?',
          answers: ['Proceed with caution', 'Stop and wait for a green light', 'Slow down and prepare to stop'],
        },
        {
          question: 'How often should you check your motorcycles tire pressure?',
          answers: ['Once a month', 'Once a year', 'Only when you notice a problem'],
        },
        {
          question: 'What is the most common cause of motorcycle accidents at intersections?',
          answers: [
            'Failure to yield the right of way',
            'Excessive speed',
            'Lack of proper protective gear',
          ],
        },
      ],
    },
    firstAid: {
      headline: 'First Aid',
      description: 'First aid - the most important test',
      photo: process.env.PUBLIC_URL + '/images/ambulance.png',
      questions: [
        {
          question: 'What should you do when approaching a stop sign?',
          answers: ['Stop completely and then proceed', 'Slow down and proceed without stopping', 'Ignore it and keep going'],
        },
        {
          question: 'When should you use your motorcycle headlights?',
          answers: [
            'Only at night',
            'During the day to increase visibility',
            'Only in bad weather conditions',
          ],
        },
        {
          question: 'What is the recommended safe following distance behind a vehicle?',
          answers: ['1 second', '2 seconds', '3 seconds'],
        },
        {
          question: 'In heavy traffic, what should you do to increase your visibility?',
          answers: [
            'Stay close to the vehicle in front of you',
            'Ride in the center of the lane',
            'Frequently change lanes',
          ],
        },
        {
          question: 'When should you use your motorcycles horn?',
          answers: [
            'To alert others of your presence in a dangerous situation',
            'To express frustration with other road users',
            'Only in residential areas',
          ],
        },
        {
          question: 'What is the correct hand signal for a right turn?',
          answers: ['Extend your left arm and point right', 'Extend your right arm and point right', 'Extend your left arm downward'],
        },
        {
          question: 'When is it important to check your mirrors?',
          answers: ['Only when changing lanes', 'Before slowing down or stopping', 'Only in urban areas'],
        },
        {
          question: 'What does it mean when a traffic light is flashing yellow?',
          answers: ['Proceed with caution', 'Stop and wait for a green light', 'Slow down and prepare to stop'],
        },
        {
          question: 'How often should you check your motorcycles tire pressure?',
          answers: ['Once a month', 'Once a year', 'Only when you notice a problem'],
        },
        {
          question: 'What is the most common cause of motorcycle accidents at intersections?',
          answers: [
            'Failure to yield the right of way',
            'Excessive speed',
            'Lack of proper protective gear',
          ],
        },
      ],
    },
  };*/