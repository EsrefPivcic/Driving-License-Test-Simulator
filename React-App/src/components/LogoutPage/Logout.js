/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const logout = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      {isLoggedIn && (
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default LogoutPage;*/