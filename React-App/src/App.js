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
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

const buttonStyle = {
  background: '#333',
  color: '#fff',
  padding: '20px',
  margin: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '10px',
  width: '300px',
  height: '300px',
};

function App() {
  const bodyStyle = {
    background: '#111',
    color: '#fff',
    margin: 0,
    padding: 0,
  };

  const appStyle = {
    textAlign: 'center',
    padding: '20px',
  };

  const titleStyle = {
    color: '#61dafb',
  };

  const categoryData = {
    a: {
      headline: 'A Category',
      description: 'A and A1 category (motorcycle and moped)',
      photo: process.env.PUBLIC_URL + '/images/motor.png',
    },
    b: {
      headline: 'B Category',
      description: 'B and B1 category (car and moped)',
      photo: process.env.PUBLIC_URL + '/images/taxi.png',
    },
    c: {
      headline: 'C Category',
      description: 'C and C1 category (truck and truck 7.5t)',
      photo: process.env.PUBLIC_URL + '/images/truck.png',
    },
    d: {
      headline: 'D Category',
      description: 'D category (bus)',
      photo: process.env.PUBLIC_URL + '/images/bus.png',
    },
    t: {
      headline: 'T Category',
      description: 'T category (tractor, working machines)',
      photo: process.env.PUBLIC_URL + '/images/tractor.png',
    },
    firstAid: {
      headline: 'First Aid',
      description: 'First aid - the most important test',
      photo: process.env.PUBLIC_URL + '/images/ambulance.png',
    },
  };

  return (
    <BrowserRouter>
      <div className="app" style={bodyStyle}>
        <div style={appStyle}>
          <h1 className="app-title" style={titleStyle}>
            eDrivingSchool
          </h1>
          <Routes>
            <Route path="/" element={<CategoryButtons categoryData={categoryData} />} />
            {Object.keys(categoryData).map((category) => (
              <Route
                key={category}
                path={`/${category.toLowerCase()}test`}
                element={<CategoryPage category={category} />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function CategoryButtons({ categoryData }) {
  return (
    <div className="categories">
      {Object.keys(categoryData).map((category) => (
        <Link key={category} to={`/${category.toLowerCase()}test`} style={{ textDecoration: 'none' }}>
          <button style={buttonStyle}>
            <img
              src={categoryData[category].photo}
              alt={categoryData[category].headline}
              style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }}
            />
            <h2>{categoryData[category].headline}</h2>
            <p>{categoryData[category].description}</p>
          </button>
        </Link>
      ))}
    </div>
  );
}

function CategoryPage({ category }) {
  return <p>This is the {category} category page</p>;
}

export default App;


