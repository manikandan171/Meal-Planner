import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setStep(2);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      setMessage('Password reset successful! You can now log in.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <form onSubmit={handleRequest}>
          <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit">Send OTP</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleReset}>
          <input name="otp" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
          <input name="newPassword" type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <button type="submit">Reset Password</button>
        </form>
      )}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ForgotPassword; 