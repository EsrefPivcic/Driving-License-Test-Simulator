import React from 'react';
import './CategoryPage.css';

function CategoryPage({ category, categoryData }) {
  const { headline, description, photo } = categoryData[category];

  return (
    <div className="category-page">
      <h2>{headline}</h2>
      <img src={photo} alt={headline} />
      <p>{description}</p>
    </div>
  );
}

export default CategoryPage;