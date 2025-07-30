import axios from 'axios';

const API = axios.create({
  baseURL: 'https://meal-planner-26dr.onrender.com/api',
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
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// Recipes
export const getRecipes = () => API.get('/recipes');
export const createRecipe = (data) => API.post('/recipes', data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
export const getRecommendedRecipes = () => API.get('/recipes/recommendations');
export const likeRecipe = (id) => API.post(`/recipes/${id}/like`);
export const dislikeRecipe = (id) => API.post(`/recipes/${id}/dislike`);

// Meal Plans
export const getMealPlans = () => API.get('/mealplans');
export const createMealPlan = (data) => API.post('/mealplans', data);
export const updateMealPlan = (id, data) => API.put(`/mealplans/${id}`, data);
export const deleteMealPlan = (id) => API.delete(`/mealplans/${id}`);

// Grocery
export const getGroceryList = () => API.get('/grocery');

// Nutrition
export const getNutrition = () => API.get('/nutrition'); 