import React, { useEffect, useState } from 'react';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../api';
import './Recipes.css';

const emptyRecipe = { title: '', ingredients: '', instructions: '', calories: '', protein: '', carbs: '', fat: '' };

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyRecipe);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRecipes();
      setRecipes(res.data);
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingId) {
        await updateRecipe(editingId, { ...form, nutrition: getNutritionObj(form) });
      } else {
        await createRecipe({ ...form, nutrition: getNutritionObj(form) });
      }
      setForm(emptyRecipe);
      setEditingId(null);
      setShowForm(false);
      fetchRecipes();
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    }
    setLoading(false);
  };

  const handleEdit = recipe => {
    setForm({ ...recipe, ...recipe.nutrition, ingredients: recipe.ingredients.map ? recipe.ingredients.map(i => i.name).join(', ') : recipe.ingredients });
    setEditingId(recipe._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    try {
      await deleteRecipe(id);
      setDeleteId(null);
      fetchRecipes();
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    }
    setLoading(false);
  };

  function getNutritionObj(f) {
    return {
      calories: Number(f.calories),
      protein: Number(f.protein),
      carbs: Number(f.carbs),
      fat: Number(f.fat)
    };
  }

  return (
    <div className="recipes-main">
      <div className="recipes-header">
        <h2>Recipes</h2>
        <button className="add-btn" onClick={() => { setShowForm(!showForm); setForm(emptyRecipe); setEditingId(null); }}>
          {showForm ? 'Close' : 'Add Recipe'}
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="recipe-form">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="ingredients" placeholder="Ingredients (comma separated)" value={form.ingredients} onChange={handleChange} required />
          <textarea name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange} required />
          <div className="nutrition-fields">
            <input name="calories" placeholder="Calories" value={form.calories} onChange={handleChange} />
            <input name="protein" placeholder="Protein (g)" value={form.protein} onChange={handleChange} />
            <input name="carbs" placeholder="Carbs (g)" value={form.carbs} onChange={handleChange} />
            <input name="fat" placeholder="Fat (g)" value={form.fat} onChange={handleChange} />
          </div>
          <button type="submit" className="save-btn">{editingId ? 'Update' : 'Add'} Recipe</button>
          {editingId && <button type="button" className="cancel-btn" onClick={() => { setForm(emptyRecipe); setEditingId(null); setShowForm(false); }}>Cancel</button>}
        </form>
      )}
      {loading ? <div className="loading">Loading...</div> : (
        <div className="recipe-cards">
          {recipes.map(r => (
            <div className="recipe-card" key={r._id}>
              <div className="card-header">
                <h3>{r.title}</h3>
                <div>
                  <button className="edit-btn" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="delete-btn" onClick={() => setDeleteId(r._id)}>Delete</button>
                </div>
              </div>
              <div className="card-section">
                <strong>Ingredients:</strong>
                <ul>
                  {(r.ingredients && r.ingredients.map) ? r.ingredients.map((i, idx) => <li key={idx}>{i.name}</li>) : (r.ingredients || '').split(',').map((i, idx) => <li key={idx}>{i.trim()}</li>)}
                </ul>
              </div>
              <div className="card-section">
                <strong>Instructions:</strong>
                <div className="instructions">{r.instructions}</div>
              </div>
              <div className="card-section nutrition">
                <strong>Nutrition:</strong>
                <div>Calories: {r.nutrition?.calories || 0} | Protein: {r.nutrition?.protein || 0}g | Carbs: {r.nutrition?.carbs || 0}g | Fat: {r.nutrition?.fat || 0}g</div>
              </div>
              {deleteId === r._id && (
                <div className="delete-confirm">
                  <span>Delete this recipe?</span>
                  <button className="confirm-btn" onClick={() => handleDelete(r._id)}>Yes</button>
                  <button className="cancel-btn" onClick={() => setDeleteId(null)}>No</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes; 