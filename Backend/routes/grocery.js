import express from 'express';
import { generateGroceryList } from '../controllers/groceryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, generateGroceryList);

export default router; 