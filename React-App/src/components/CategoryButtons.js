import React from 'react';
import { Link } from 'react-router-dom';

function CategoryButtons({ categoryData }) {

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

  export default CategoryButtons;