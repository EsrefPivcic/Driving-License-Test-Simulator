import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

function RegistrationPage() {
  const [user, setUser] = useState({
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
    setTimeout(() => {
      setComponentVisible(true);
    }, 100);
  }, []);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Z][a-zA-Z]*$/;
    return nameRegex.test(name);
  };  

  const validateUsername = (username) => {
    return /^\S+$/.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const { Name, Surname, Username, Email, Password } = user;

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
      const updatedUser = { ...user };

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setError('');
        setMessage('Registration successful! You can now log in.');
        setTimeout(() => {
          setMessage('');
          navigate('/login');
        }, 2000);
      } else if (response.status === 409) {
        setError('Username or email already exists. Please choose a different username.');
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
      <form className="add-registration-form" onSubmit={handleRegistration}>
        <h2 className="add-registration-headline">Create an Account</h2>
        <label className="add-registration-label">
          Name:
          <input type="text" name="Name" value={user.Name} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Surname:
          <input type="text" name="Surname" value={user.Surname} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Username:
          <input type="text" name="Username" value={user.Username} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Email:
          <input type="text" name="Email" value={user.Email} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <label className="add-registration-label">
          Password:
          <input type="password" name="Password" value={user.Password} onChange={handleInputChange} className="add-registration-input" required />
        </label>
        <button type="submit" className="add-registration-button">Register</button>
        {error && <div className="register-warning-container">
                <div className="register-warning">
                  <h5>{error}</h5>
                </div>
              </div>}
              <p className='dont-have-text'>
        Already have an account?{' '}
        <span className="login-btn" onClick={handleLoginClick}>
          Login
        </span>
      </p>
      </form>
      </animated.div>
  );
}

export default RegistrationPage;