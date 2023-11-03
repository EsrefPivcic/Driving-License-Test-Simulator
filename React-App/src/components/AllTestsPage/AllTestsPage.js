import React from "react";
import { Link } from "react-router-dom";
import "./AllTestsPage.css";

function AllTestsPage({ testData }) {
  return (
    <div className="categories">
      {testData.map((test) => (
        <Link
          key={test}
          to={`/${test.Category.toLowerCase()}test`}
          style={{ textDecoration: "none" }}
        >
          <button className="buttonStyle" key={test.ID}>
            <img
              src={`data:image/png;base64,${test.ImageBase64}`}
              alt={`Test: ${test.Title}`}
              className="category-image"
            />
            <h2>{test.Title}</h2>
            <p>{test.Description}</p>
          </button>
        </Link>
      ))}
      <div>
        <Link to={`/addtests`} style={{ textDecoration: "none" }}>
          <button className="buttonStyle2">
            <h2>Add tests</h2>
          </button>
        </Link>
      </div>
    </div>
    /*<div className="categories">
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
    </div>*/
  );
}

export default AllTestsPage;
