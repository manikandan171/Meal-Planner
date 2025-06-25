import React, { createContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, getProfile } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await getProfile();
          setUser(res.data);
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
  };

  const register = async (data) => {
    try {
      await apiRegister(data); // Register the user
      // After successful registration, log in automatically
      const res = await apiLogin({ email: data.email, password: data.password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed';
    }
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