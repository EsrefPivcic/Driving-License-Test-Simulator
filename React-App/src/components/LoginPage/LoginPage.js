import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const {setAuthStatus} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

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
      setAuthStatus(token);
      
      navigate(`/`, { state: { login: true } });
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <animated.div style={fadeIn}>
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
          {'Login'} {}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Don't have an account?{' '}
        <span className="register-button" onClick={handleRegisterClick}>
          Register
        </span>
      </p>
    </div>
    </animated.div>
  );
}

export default LoginPage;