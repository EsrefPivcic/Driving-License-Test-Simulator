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
        <Link to={`/addtest`} style={{ textDecoration: "none" }}>
          <button className="buttonStyle2">
            <h2>Add Test</h2>
          </button>
        </Link>
        <Link to={`/addquestion`} style={{ textDecoration: "none" }}>
          <button className="buttonStyle2">
            <h2>Add Question</h2>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AllTestsPage;