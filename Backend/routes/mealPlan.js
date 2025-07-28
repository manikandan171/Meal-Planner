import express from 'express';
import { getMealPlans, createMealPlan, updateMealPlan, deleteMealPlan } from '../controllers/mealPlanController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getMealPlans);
router.post('/', authMiddleware, createMealPlan);
router.put('/:id', authMiddleware, updateMealPlan);
router.delete('/:id', authMiddleware, deleteMealPlan);

export default router; 