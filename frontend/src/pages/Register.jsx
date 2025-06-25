import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/register', form);
      setEmail(form.email);
      setStep(2);
      setMessage('OTP sent to your email. Please verify.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/verify-otp', { email, otp });
      setMessage('Account verified! You can now log in.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit">Register</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerify}>
          <input name="otp" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
          <button type="submit">Verify OTP</button>
        </form>
      )}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Register; 