import React, { useState, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await login(email, password);
      setSuccess('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Login; 