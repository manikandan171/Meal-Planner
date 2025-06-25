import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Recipes
export const getRecipes = () => API.get('/recipes');
export const createRecipe = (data) => API.post('/recipes', data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);

// Meal Plans
export const getMealPlans = () => API.get('/mealplans');
export const createMealPlan = (data) => API.post('/mealplans', data);
export const updateMealPlan = (id, data) => API.put(`/mealplans/${id}`, data);
export const deleteMealPlan = (id) => API.delete(`/mealplans/${id}`);

// Grocery
export const getGroceryList = () => API.get('/grocery');

// Nutrition
export const getNutrition = () => API.get('/nutrition'); 