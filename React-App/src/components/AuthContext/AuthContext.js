import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const setAuthStatus = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
  };

  const clearAuthStatus = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  const ValidateToken = async () => {
    try {
      const response = await fetch('http://localhost:8080/checktoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token validation failed:', error);
    }
  };

  const LogOut = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      else {
      clearAuthStatus();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const contextValue = {
    authToken,
    setAuthStatus,
    clearAuthStatus,
    isAuthenticated: !!authToken,
    ValidateToken,
    LogOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);