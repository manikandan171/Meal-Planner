import React, { useEffect, useState, useContext } from 'react';
import { getNutrition } from '../api';
import './Nutrition.css';
import { AuthContext } from '../hooks/AuthContext';

const Nutrition = () => {
  const { user } = useContext(AuthContext);
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

  const CircularProgress = ({ value, goal, label, color, unit = '' }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    
    useEffect(() => {
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = value / steps;
      const percentageIncrement = getPercent(value, goal) / steps;
      
      let currentValue = 0;
      let currentPercentage = 0;
      
      const timer = setInterval(() => {
        currentValue += increment;
        currentPercentage += percentageIncrement;
        
        if (currentValue >= value) {
          setAnimatedValue(value);
          setAnimatedPercentage(getPercent(value, goal));
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(currentValue));
          setAnimatedPercentage(Math.floor(currentPercentage));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }, [value, goal]);
    
    const radius = 60;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

    return (
      <div className="circular-progress">
        <svg width="140" height="140" className="circular-svg">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            className="progress-circle"
          />
        </svg>
        <div className="circular-content">
          <div className="circular-value">{animatedValue}{unit}</div>
          <div className="circular-label">{label}</div>
          <div className="circular-goal">/ {goal}{unit}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="nutrition-main">
      {(!user) ? (
        <div className="error-msg">Please login to view your data.</div>
      ) : (
        <>
          <h2>Weekly Nutrition Summary</h2>
          {error && <div className="error-msg">{error}</div>}
          <div className="nutrition-charts">
            <CircularProgress
              value={nutrition.calories}
              goal={goals.calories * 7}
              label="Calories"
              color="#6366f1"
            />
            <CircularProgress
              value={nutrition.protein}
              goal={goals.protein * 7}
              label="Protein"
              color="#22c55e"
              unit="g"
            />
            <CircularProgress
              value={nutrition.carbs}
              goal={goals.carbs * 7}
              label="Carbs"
              color="#f59e42"
              unit="g"
            />
            <CircularProgress
              value={nutrition.fat}
              goal={goals.fat * 7}
              label="Fat"
              color="#f43f5e"
              unit="g"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Nutrition; 