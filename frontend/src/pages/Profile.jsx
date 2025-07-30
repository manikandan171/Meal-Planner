import React, { useContext, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    dietaryPreferences: user?.dietaryPreferences?.join(', ') || '',
    allergies: user?.allergies?.join(', ') || '',
    dislikes: user?.dislikes?.join(', ') || '',
    goals: user?.goals || ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.put('/api/auth/profile', {
        dietaryPreferences: form.dietaryPreferences.split(',').map(s => s.trim()),
        allergies: form.allergies.split(',').map(s => s.trim()),
        dislikes: form.dislikes.split(',').map(s => s.trim()),
        goals: form.goals
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated!');
    } catch (err) {
      setError('Could not update profile.');
    }
    setLoading(false);
  };

  if (!user) return <div className="profile-container"><div className="profile-card">Please log in to view your profile.</div></div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <form onSubmit={handleUpdate}>
          <div className="profile-field">
            <label>Dietary Preferences</label>
            <input
              name="dietaryPreferences"
              value={form.dietaryPreferences}
              onChange={e => setForm({ ...form, dietaryPreferences: e.target.value })}
              placeholder="e.g. vegetarian, vegan"
            />
          </div>
          <div className="profile-field">
            <label>Allergies</label>
            <input
              name="allergies"
              value={form.allergies}
              onChange={e => setForm({ ...form, allergies: e.target.value })}
              placeholder="e.g. peanuts, shellfish"
            />
          </div>
          <div className="profile-field">
            <label>Dislikes</label>
            <input
              name="dislikes"
              value={form.dislikes}
              onChange={e => setForm({ ...form, dislikes: e.target.value })}
              placeholder="e.g. broccoli, mushrooms"
            />
          </div>
          <div className="profile-field">
            <label>Goals</label>
            <input
              name="goals"
              value={form.goals}
              onChange={e => setForm({ ...form, goals: e.target.value })}
              placeholder="e.g. lose weight, gain muscle, eat healthier"
            />
          </div>
          <button className="profile-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Profile'}</button>
        </form>
        {message && <div className="profile-success">{message}</div>}
        {error && <div className="profile-error">{error}</div>}
      </div>
    </div>
  );
};

export default Profile; 