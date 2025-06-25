import React, { useState, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    dietaryPreferences: '',
    allergies: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        ...form,
        dietaryPreferences: form.dietaryPreferences.split(',').map(s => s.trim()),
        allergies: form.allergies.split(',').map(s => s.trim())
      });
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="dietaryPreferences" placeholder="Dietary Preferences (comma separated)" value={form.dietaryPreferences} onChange={handleChange} />
        <input name="allergies" placeholder="Allergies (comma separated)" value={form.allergies} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register; 