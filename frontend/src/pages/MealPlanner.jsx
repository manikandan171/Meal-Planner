import React, { useEffect, useState, useContext } from 'react';
import { getMealPlans, createMealPlan, updateMealPlan, getRecipes } from '../api';
import './MealPlanner.css';
import { AuthContext } from '../hooks/AuthContext';
import LoadingSpinner from '../assets/componenets/LoadingSpinner';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealPlanner = () => {
  const { user } = useContext(AuthContext);
  const [mealPlans, setMealPlans] = useState([]);
  const [currentWeekPlan, setCurrentWeekPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  // Add a refresh function that can be called when needed
  const refreshRecipes = async () => {
    try {
      const rRes = await getRecipes();
      setRecipes(rRes.data);
    } catch (err) {
      console.error('Failed to refresh recipes:', err);
    }
  };

  const fetchData = async () => {
    setError('');
    setLoading(true);
    try {
      const [mpRes, rRes] = await Promise.all([getMealPlans(), getRecipes()]);
      setMealPlans(mpRes.data);
      setRecipes(rRes.data);
      
      // Find current week's meal plan
      const currentWeek = getCurrentWeekStart();
      const currentPlan = mpRes.data.find(plan => {
        const planDate = new Date(plan.weekStart);
        return planDate.getTime() === currentWeek.getTime();
      });
      
      if (currentPlan) {
        setCurrentWeekPlan(currentPlan);
        // Convert meal plan data to selected format
        const selectedMeals = {};
        currentPlan.days.forEach(day => {
          day.meals.forEach(meal => {
            if (meal.recipe) {
              selectedMeals[`${day.dayName}-${meal.type}`] = meal.recipe._id || meal.recipe;
            }
          });
        });
        setSelected(selectedMeals);
      }
    } catch (err) {
      setError('Could not load meal plans. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(now.setDate(diff));
  };

  const handleSelect = (day, mealType, recipeId) => {
    setSelected(prev => ({ ...prev, [`${day}-${mealType}`]: recipeId }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const weekStart = getCurrentWeekStart();
      const days = daysOfWeek.map((day, i) => ({
        dayName: day,
        date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i),
        meals: mealTypes.map(type => ({ 
          type, 
          recipe: selected[`${day}-${type}`] || null 
        }))
      }));

      if (currentWeekPlan) {
        // Update existing meal plan
        await updateMealPlan(currentWeekPlan._id, { weekStart, days });
        setSuccess('Meal plan updated successfully!');
      } else {
        // Create new meal plan
        await createMealPlan({ weekStart, days });
        setSuccess('Meal plan saved successfully!');
      }
      
      // Refresh data to show updated meal plan
      await fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Could not save meal plan. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setSelected({});
    setCurrentWeekPlan(null);
  };

  const getRecipeTitle = (recipeId) => {
    if (!recipeId) return 'No meal planned';
    const recipe = recipes.find(r => r._id === recipeId);
    return recipe ? recipe.title : 'Recipe not found';
  };

  const renderMealPlanDetails = (plan) => {
    if (!plan.days || plan.days.length === 0) {
      return <p className="no-meals">No meals planned for this week</p>;
    }

    return (
      <div className="meal-plan-details">
        <div className="details-table-wrapper">
          <table className="details-table">
            <thead>
              <tr>
                <th>Day</th>
                {mealTypes.map(type => (
                  <th key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.days.map((day, dayIndex) => (
                <tr key={dayIndex} className="detail-row">
                  <td className="detail-day-cell">
                    {day.dayName || daysOfWeek[dayIndex] || `Day ${dayIndex + 1}`}
                  </td>
                  {mealTypes.map((mealType, mealIndex) => {
                    const meal = day.meals.find(m => m.type === mealType);
                    const recipeTitle = getRecipeTitle(meal?.recipe);
                    return (
                      <td key={mealIndex} className="detail-meal-cell">
                        {meal?.recipe ? (
                          <div className="meal-confirmation">
                            {recipeTitle}
                          </div>
                        ) : (
                          <div className="meal-empty">
                            No meal planned
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const todayIdx = new Date().getDay() - 1;

  if (loading) {
    return (
      <div className="mealplanner-main">
        <LoadingSpinner size="large" text="Loading meal plans..." />
      </div>
    );
  }

  return (
    <div className="mealplanner-main">
      {(!user) ? (
        <div className="error-msg">Please login to view your meal plans.</div>
      ) : (
        <>
          <h2>Weekly Meal Planner</h2>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          
          <div className="planner-table-wrapper">
            <table className="planner-table">
              <thead>
                <tr>
                  <th>Day</th>
                  {mealTypes.map(type => (
                    <th key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day, idx) => (
                  <tr key={day} className={idx === todayIdx ? 'today-row' : ''}>
                    <td className="day-cell">{day}</td>
                    {mealTypes.map(type => (
                      <td key={type} className="meal-cell">
                        <select 
                          value={selected[`${day}-${type}`] || ''} 
                          onChange={e => handleSelect(day, type, e.target.value)}
                          className="meal-select"
                        >
                          <option value="">Select Recipe</option>
                          {recipes.map(r => (
                            <option key={r._id} value={r._id}>
                              {r.title}
                            </option>
                          ))}
                        </select>
                        {selected[`${day}-${type}`] && (
                          <div className="selected-recipe">
                            {recipes.find(r => r._id === selected[`${day}-${type}`])?.title}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="planner-actions">
            <button 
              onClick={handleSave} 
              className="save-btn" 
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner spinner-small"></div>
                  <span>Saving...</span>
                </>
              ) : (
                currentWeekPlan ? 'Update Meal Plan' : 'Save Meal Plan'
              )}
            </button>
            <button onClick={handleClear} className="cancel-btn">Clear</button>
          </div>
          
          <div className="meal-plans-section">
            <h3>Previous Meal Plans</h3>
            {mealPlans.length > 0 ? (
              <div className="meal-plans-grid">
                {mealPlans.map(plan => (
                  <div key={plan._id} className="meal-plan-card">
                    <div className="plan-header">
                      <h4>Week of {new Date(plan.weekStart).toLocaleDateString()}</h4>
                      <span className="plan-days">{plan.days?.length || 0} days planned</span>
                    </div>
                    {renderMealPlanDetails(plan)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-plans">No meal plans found. Create your first meal plan above!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MealPlanner; 