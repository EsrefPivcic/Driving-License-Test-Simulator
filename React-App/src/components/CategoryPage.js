import React from 'react';

function CategoryPage({ category, categoryData }) {
    const { headline, description, photo } = categoryData[category];
  
    return (
      <div>
        <h2>{headline}</h2>
        <img src={photo} alt={headline} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        <p>{description}</p>
      </div>
    );
  }

  export default CategoryPage;