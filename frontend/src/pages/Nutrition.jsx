import React, { useEffect, useState } from 'react';
import { getNutrition } from '../api';
import './Nutrition.css';

const Nutrition = () => {
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    fetchNutrition();
  }, []);

  const fetchNutrition = async () => {
    setError('');
    try {
      const res = await getNutrition();
      setNutrition(res.data);
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    }
  };

  // Example daily goals
  const goals = { calories: 2000, protein: 100, carbs: 250, fat: 70 };

  function getPercent(val, goal) {
    return Math.min(100, Math.round((val / goal) * 100));
  }

  return (
    <div className="nutrition-main">
      <h2>Weekly Nutrition Summary</h2>
      {error && <div className="error-msg">{error}</div>}
      <div className="nutrition-bars">
        <div className="nutri-bar">
          <span>Calories: {nutrition.calories} / {goals.calories * 7}</span>
          <div className="bar-bg"><div className="bar-fill" style={{width: getPercent(nutrition.calories, goals.calories * 7) + '%'}} /></div>
        </div>
        <div className="nutri-bar">
          <span>Protein: {nutrition.protein}g / {goals.protein * 7}g</span>
          <div className="bar-bg"><div className="bar-fill" style={{width: getPercent(nutrition.protein, goals.protein * 7) + '%', background: '#22c55e'}} /></div>
        </div>
        <div className="nutri-bar">
          <span>Carbs: {nutrition.carbs}g / {goals.carbs * 7}g</span>
          <div className="bar-bg"><div className="bar-fill" style={{width: getPercent(nutrition.carbs, goals.carbs * 7) + '%', background: '#f59e42'}} /></div>
        </div>
        <div className="nutri-bar">
          <span>Fat: {nutrition.fat}g / {goals.fat * 7}g</span>
          <div className="bar-bg"><div className="bar-fill" style={{width: getPercent(nutrition.fat, goals.fat * 7) + '%', background: '#f43f5e'}} /></div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition; 