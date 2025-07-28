import React, { useState } from 'react';
import axios from 'axios';
import { forgotPassword as forgotPasswordApi, resetPassword as resetPasswordApi } from '../api';
import LoadingSpinner from '../assets/componenets/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import PasswordStrength from '../assets/componenets/PasswordStrength';
import { validatePassword } from '../utils/passwordValidation';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setIsRequesting(true);
    
    try {
      await forgotPasswordApi({ email });
      setStep(2);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate new password before submitting
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(', '));
      return;
    }
    
    setIsResetting(true);
    
    try {
      await resetPasswordApi({ email, otp, newPassword });
      // Stop animation immediately and navigate
      setIsResetting(false);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setIsResetting(false);
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <form onSubmit={handleRequest}>
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={isRequesting}
          />
          <button 
            type="submit" 
            disabled={isRequesting}
            className={isRequesting ? 'button-loading' : ''}
          >
            {isRequesting ? (
              <>
                <div className="spinner spinner-small"></div>
                <span>Sending OTP...</span>
              </>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleReset}>
          <input 
            name="otp" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            required 
            disabled={isResetting}
          />
          <input 
            name="newPassword" 
            type="password" 
            placeholder="New Password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            required 
            disabled={isResetting}
          />
          <PasswordStrength password={newPassword} />
          <button 
            type="submit" 
            disabled={isResetting}
            className={isResetting ? 'button-loading' : ''}
          >
            {isResetting ? (
              <>
                <div className="spinner spinner-small"></div>
                <span>Resetting Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}
      {step === 3 && (
        <div className="loading-container">
          <LoadingSpinner size="medium" text="Password reset successful!" />
        </div>
      )}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ForgotPassword; 