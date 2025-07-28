import React, { useState, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../assets/componenets/LoadingSpinner';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Stop animation immediately and navigate
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          disabled={isLoading}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? 'button-loading' : ''}
        >
          {isLoading ? (
            <>
              <div className="spinner spinner-small"></div>
              <span>Signing In...</span>
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login; 