import express from 'express';
import { getNutritionSummary } from '../controllers/nutritionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getNutritionSummary);

export default router; 