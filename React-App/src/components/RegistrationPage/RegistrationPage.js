import React, { useState } from 'react';
import './RegistrationPage.css';

function RegistrationPage() {
  const [student, setStudent] = useState({
    Name: '',
    Surname: '',
    Username: '',
    Email: '',
    Password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedStudent = { ...student};
        
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        body: JSON.stringify(updatedStudent),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Handle success
      } else {
        // Handle failure
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="add-registration-form" onSubmit={handleSubmit}>
      <h2 className="add-registration-headline">Create an Account</h2>
      <label className="add-registration-label">
        Name:
        <input type="text" name="Name" value={student.Name} onChange={handleInputChange} className="add-registration-input" />
      </label>
      <label className="add-registration-label">
        Surname:
        <input type="text" name="Surname" value={student.Surname} onChange={handleInputChange} className="add-registration-input" />
      </label>
      <label className="add-registration-label">
        Username:
        <input type="text" name="Username" value={student.Username} onChange={handleInputChange} className="add-registration-input" />
      </label>
      <label className="add-registration-label">
        Email:
        <input type="text" name="Email" value={student.Email} onChange={handleInputChange} className="add-registration-input" />
      </label>
      <label className="add-registration-label">
        Password:
        <input type="password" name="Password" value={student.Password} onChange={handleInputChange} className="add-registration-input" />
      </label>
      <button type="submit" className="add-registration-button">Register</button>
    </form>
  );
}

export default RegistrationPage;