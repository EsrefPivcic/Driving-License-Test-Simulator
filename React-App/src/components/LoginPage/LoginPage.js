import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      const token = data.token;

      localStorage.setItem('token', token);

      setIsLoggedIn(true);

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2 className="login-headline">Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label className="add-login-label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="add-login-input"
            required
          />
        </label>
        <label className="add-login-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="add-login-input"
            required
          />
        </label>
        <button type="submit" className="add-login-button">
          {isLoggedIn ? '' : 'Login'} {}
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <span className="register-button" onClick={handleRegisterClick}>
          Register
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
