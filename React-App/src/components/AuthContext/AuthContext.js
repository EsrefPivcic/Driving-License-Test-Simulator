import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [login, setLogin] = useState(false);

  const [userData, setUserData] = useState({
    Name: '',
    Surname: '',
    Username: '',
    Email: '',
    Password: '',
    ImageBase64: '',
    IsStudent: false,
    IsAdmin: false
  });

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/user/getbytoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [authToken, setUserData]);

  const setAuthStatus = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
  };

  const clearAuthStatus = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  const openLogin = () => {
    setLogin(true);
  }

  const closeLogin = () => {
    setLogin(false);
  }
  
const validateToken = useCallback(async () => {
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
}, [authToken]);

  const handleLogout = async () => {
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
    login,
    setAuthStatus,
    openLogin,
    closeLogin,
    clearAuthStatus,
    isAuthenticated: !!authToken,
    validateToken,
    handleLogout,
    userData,
    fetchUserData,
    setUserData
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
