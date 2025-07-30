import { Recipe } from '../model/recipe.js';
import axios from 'axios';
import { API_KEYS } from '../config/api.js';

export const getRecipes = async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.category) query.categories = req.query.category;
    if (req.query.cuisine) query.cuisine = req.query.cuisine;
    if (req.query.maxPrepTime) query.prepTime = { $lte: Number(req.query.maxPrepTime) };
    if (req.query.ingredient) query['ingredients.name'] = req.query.ingredient;
    // Optionally: filter by nutrition, etc.
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, user: req.user.id });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const recommendRecipes = async (req, res) => {
  try {
    const user = req.user;
    // Fetch user preferences
    const dietaryPreferences = user.dietaryPreferences || [];
    const allergies = user.allergies || [];
    const dislikes = user.dislikes || [];
    // Build query
    let query = {};
    if (dietaryPreferences.length > 0) {
      query.categories = { $in: dietaryPreferences };
    }
    // Find recipes that do not contain any disliked ingredients or allergies
    if (allergies.length > 0 || dislikes.length > 0) {
      query['ingredients.name'] = { $nin: [...allergies, ...dislikes] };
    }
    // Optionally, filter by nutrition/goals here
    const recipes = await Recipe.find(query).limit(10);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeRecipe = async (req, res) => {
  try {
    const user = req.user;
    const recipeId = req.params.id;
    if (!user.likedRecipes.includes(recipeId)) {
      user.likedRecipes.push(recipeId);
      user.dislikedRecipes = user.dislikedRecipes.filter(rid => rid.toString() !== recipeId);
      await user.save();
    }
    res.json({ message: 'Recipe liked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const dislikeRecipe = async (req, res) => {
  try {
    const user = req.user;
    const recipeId = req.params.id;
    if (!user.dislikedRecipes.includes(recipeId)) {
      user.dislikedRecipes.push(recipeId);
      user.likedRecipes = user.likedRecipes.filter(rid => rid.toString() !== recipeId);
      await user.save();
    }
    res.json({ message: 'Recipe disliked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const recommendOnlineRecipes = async (req, res) => {
  try {
    const { dietaryPreferences, allergies, dislikes } = req.user;
    const apiKey = API_KEYS.SPOONACULAR_API_KEY;
    let query = `https://api.spoonacular.com/recipes/complexSearch?number=5&addRecipeInformation=true&addNutrition=true&apiKey=${apiKey}`;
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      query += `&diet=${encodeURIComponent(dietaryPreferences.join(','))}`;
    }
    if (allergies && allergies.length > 0) {
      query += `&intolerances=${encodeURIComponent(allergies.join(','))}`;
    }
    if (dislikes && dislikes.length > 0) {
      query += `&excludeIngredients=${encodeURIComponent(dislikes.join(','))}`;
    }
    const { data } = await axios.get(query);
    const recipes = [];
    for (const r of data.results || []) {
      try {
        const detailsRes = await axios.get(
          `https://api.spoonacular.com/recipes/${r.id}/information?includeNutrition=true&apiKey=${apiKey}`
        );
        const details = detailsRes.data;
        recipes.push({
          title: details.title,
          ingredients: details.extendedIngredients?.map(i => ({ name: i.original })) || [{ name: 'No ingredients listed' }],
          instructions: details.analyzedInstructions?.[0]?.steps?.map(s => s.step).join(' ') || details.instructions || 'No instructions provided.',
          nutrition: {
            calories: details.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount ?? 'N/A',
            protein: details.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount ?? 'N/A',
            carbs: details.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount ?? 'N/A',
            fat: details.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount ?? 'N/A',
          }
        });
      } catch (err) {
        // Optionally handle errors for individual recipes
      }
    }
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch online recipes.' });
  }
}; 