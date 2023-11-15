import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

function RegistrationPage() {
  const [student, setStudent] = useState({
    Name: '',
    Surname: '',
    Username: '',
    Email: '',
    Password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isComponentVisible, setComponentVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setComponentVisible(true);
  }, []);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Z][a-z]*$/;
    return nameRegex.test(name);
  };

  const validateUsername = (username) => {
    return !/\s/.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { Name, Surname, Username, Email, Password } = student;

    if (!validateName(Name)) {
      setError('Name must start with a capital letter and should not have spaces.');
      return;
    }

    if (!validateName(Surname)) {
      setError('Surname must start with a capital letter and should not have spaces.');
      return;
    }

    if (!validateUsername(Username)) {
      setError('Username should not have spaces.');
      return;
    }

    if (!validateEmail(Email)) {
      setError('Invalid email format. Please enter a valid email address.');
      return;
    }

    if (Password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const updatedStudent = { ...student };

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        body: JSON.stringify(updatedStudent),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        setTimeout(() => {
          setMessage('');
          navigate('/login');
        }, 2000);
      } else if (response.status === 409) {
        setError('Username already exists. Please choose a different username.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <animated.div style={fadeIn}>
      {message && <p className="message">{message}</p>}
      <form className="add-registration-form" onSubmit={handleSubmit}>
        <h2 className="add-registration-headline">Create an Account</h2>
        <label className="add-registration-label">
          Name:
          <input type="text" name="Name" value={student.Name} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Surname:
          <input type="text" name="Surname" value={student.Surname} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Username:
          <input type="text" name="Username" value={student.Username} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Email:
          <input type="text" name="Email" value={student.Email} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Password:
          <input type="password" name="Password" value={student.Password} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <button type="submit" className="add-registration-button">Register</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      </animated.div>
  );
}

export default RegistrationPage;