import express from 'express';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getRecipes);
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

export default router; 