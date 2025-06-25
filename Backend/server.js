import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './config/db.js';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipe.js';
import mealPlanRoutes from './routes/mealPlan.js';
import groceryRoutes from './routes/grocery.js';
import nutritionRoutes from './routes/nutrition.js';

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/nutrition', nutritionRoutes);

app.get('/', (req, res) => {
  res.send('Smart Meal Planner API is running');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
