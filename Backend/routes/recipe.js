import express from 'express';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, recommendRecipes, likeRecipe, dislikeRecipe } from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getRecipes);
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);
router.get('/recommendations', authMiddleware, recommendRecipes);
router.post('/:id/like', authMiddleware, likeRecipe);
router.post('/:id/dislike', authMiddleware, dislikeRecipe);

export default router; 