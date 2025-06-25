import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Optionally fetch user profile here
      setUser({}); // Placeholder
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    // Call backend API
    // On success:
    // setToken(tokenFromServer);
    // setUser(userFromServer);
    // localStorage.setItem('token', tokenFromServer);
  };

  const register = async (data) => {
    // Call backend API
    // On success, call login
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 