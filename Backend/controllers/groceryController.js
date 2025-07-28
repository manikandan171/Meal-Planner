import { MealPlan } from '../model/mealPlan.js';
import { Recipe } from '../model/recipe.js';

export const generateGroceryList = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id }).populate('days.meals.recipe');
    const ingredientsMap = {};
    mealPlans.forEach(plan => {
      plan.days.forEach(day => {
        day.meals.forEach(meal => {
          if (meal.recipe && meal.recipe.ingredients) {
            meal.recipe.ingredients.forEach(ing => {
              const key = ing.name.toLowerCase();
              if (!ingredientsMap[key]) ingredientsMap[key] = [];
              ingredientsMap[key].push(ing.quantity);
            });
          }
        });
      });
    });
    const groceryList = Object.entries(ingredientsMap).map(([name, quantities]) => ({
      name,
      quantities
    }));
    res.json(groceryList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 