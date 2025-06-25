import React, { useEffect, useState } from 'react';
import { getMealPlans, createMealPlan, getRecipes } from '../api';
import './MealPlanner.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError('');
    try {
      const [mpRes, rRes] = await Promise.all([getMealPlans(), getRecipes()]);
      setMealPlans(mpRes.data);
      setRecipes(rRes.data);
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    }
  };

  const handleSelect = (day, mealType, recipeId) => {
    setSelected(prev => ({ ...prev, [`${day}-${mealType}`]: recipeId }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const weekStart = new Date();
      const days = daysOfWeek.map((day, i) => ({
        date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i),
        meals: mealTypes.map(type => ({ type, recipe: selected[`${day}-${type}`] }))
      }));
      await createMealPlan({ weekStart, days });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setLoading(false);
      fetchData();
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
      setLoading(false);
    }
  };

  const handleClear = () => setSelected({});

  const todayIdx = new Date().getDay() - 1;

  return (
    <div className="mealplanner-main">
      <h2>Weekly Meal Planner</h2>
      {error && <div className="error-msg">{error}</div>}
      <div className="planner-table-wrapper">
        <table className="planner-table">
          <thead>
            <tr>
              <th>Day</th>
              {mealTypes.map(type => <th key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</th>)}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day, idx) => (
              <tr key={day} className={idx === todayIdx ? 'today-row' : ''}>
                <td>{day}</td>
                {mealTypes.map(type => (
                  <td key={type}>
                    <select value={selected[`${day}-${type}`] || ''} onChange={e => handleSelect(day, type, e.target.value)}>
                      <option value="">--</option>
                      {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="planner-actions">
        <button onClick={handleSave} className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Meal Plan'}</button>
        <button onClick={handleClear} className="cancel-btn">Clear</button>
        {saved && <span className="saved-msg">Meal plan saved!</span>}
      </div>
      <h3>Saved Meal Plans</h3>
      <ul className="saved-plans-list">
        {mealPlans.map(mp => (
          <li key={mp._id}>{new Date(mp.weekStart).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlanner; 