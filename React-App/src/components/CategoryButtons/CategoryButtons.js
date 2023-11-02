// CategoryButtons.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryButtons.css';

function CategoryButtons({ categoryData }) {
  return (
    <div className="categories">
      {Object.keys(categoryData).map((category) => (
        <Link key={category} to={`/${category.toLowerCase()}test`} style={{ textDecoration: 'none' }}>
          <button className="buttonStyle">
            <img
              src={categoryData[category].photo}
              alt={categoryData[category].headline}
              className="category-image"
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