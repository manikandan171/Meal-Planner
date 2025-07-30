import { Recipe } from '../model/recipe.js';

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