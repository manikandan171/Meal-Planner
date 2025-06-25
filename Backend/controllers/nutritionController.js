import { MealPlan } from '../model/mealPlan.js';
import { Recipe } from '../model/recipe.js';

export const getNutritionSummary = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id }).populate('days.meals.recipe');
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    mealPlans.forEach(plan => {
      plan.days.forEach(day => {
        day.meals.forEach(meal => {
          if (meal.recipe && meal.recipe.nutrition) {
            total.calories += meal.recipe.nutrition.calories || 0;
            total.protein += meal.recipe.nutrition.protein || 0;
            total.carbs += meal.recipe.nutrition.carbs || 0;
            total.fat += meal.recipe.nutrition.fat || 0;
          }
        });
      });
    });
    res.json(total);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 