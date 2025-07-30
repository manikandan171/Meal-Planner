import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { register as registerApi, verifyOtp as verifyOtpApi } from '../api';
import LoadingSpinner from '../assets/componenets/LoadingSpinner';
import PasswordStrength from '../assets/componenets/PasswordStrength';
import { validatePassword } from '../utils/passwordValidation';

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', dietaryPreferences: [], allergies: [], dislikes: [] });
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password before submitting
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(', '));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerApi(form);
      setEmail(form.email);
      setStep(2);
      setMessage('OTP sent to your email. Please verify.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);
    
    try {
      await verifyOtpApi({ email, otp });
      // Stop animation immediately and navigate
      setIsVerifying(false);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      setIsVerifying(false);
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <form onSubmit={handleRegister}>
          <input 
            name="name" 
            placeholder="Full Name" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            required 
            disabled={isLoading}
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            required 
            disabled={isLoading}
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            required 
            disabled={isLoading}
          />
          <PasswordStrength password={form.password} />
          <label>Dietary Preferences (comma separated):</label>
          <input
            name="dietaryPreferences"
            placeholder="e.g. vegetarian, vegan"
            value={form.dietaryPreferences}
            onChange={e => setForm({ ...form, dietaryPreferences: e.target.value.split(',').map(s => s.trim()) })}
            disabled={isLoading}
          />
          <label>Allergies (comma separated):</label>
          <input
            name="allergies"
            placeholder="e.g. peanuts, shellfish"
            value={form.allergies}
            onChange={e => setForm({ ...form, allergies: e.target.value.split(',').map(s => s.trim()) })}
            disabled={isLoading}
          />
          <label>Dislikes (comma separated):</label>
          <input
            name="dislikes"
            placeholder="e.g. broccoli, mushrooms"
            value={form.dislikes}
            onChange={e => setForm({ ...form, dislikes: e.target.value.split(',').map(s => s.trim()) })}
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
                <span>Creating Account...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerify}>
          <input 
            name="otp" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            required 
            disabled={isVerifying}
          />
          <button 
            type="submit" 
            disabled={isVerifying}
            className={isVerifying ? 'button-loading' : ''}
          >
            {isVerifying ? (
              <>
                <div className="spinner spinner-small"></div>
                <span>Verifying OTP...</span>
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      )}
      {step === 3 && (
        <div className="loading-container">
          <LoadingSpinner size="medium" text="Account verified successfully!" />
        </div>
      )}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Register; 