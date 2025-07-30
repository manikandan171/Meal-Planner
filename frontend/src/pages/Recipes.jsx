import React, { useEffect, useState, useContext } from 'react';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, getRecommendedRecipes, likeRecipe as likeRecipeApi, dislikeRecipe as dislikeRecipeApi } from '../api';
import './Recipes.css';
import { AuthContext } from '../hooks/AuthContext';

const emptyRecipe = { title: '', ingredients: '', instructions: '', calories: '', protein: '', carbs: '', fat: '' };

const Recipes = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyRecipe);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommended, setRecommended] = useState([]);

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

  useEffect(() => {
    fetchRecipes();
    const fetchRecommended = async () => {
      try {
        const res = await getRecommendedRecipes();
        setRecommended(res.data);
      } catch {}
    };
    fetchRecommended();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ingredientsArr = form.ingredients.split(',').map(i => ({ name: i.trim(), quantity: '' }));
      if (editingId) {
        await updateRecipe(editingId, { ...form, ingredients: ingredientsArr, nutrition: getNutritionObj(form) });
      } else {
        await createRecipe({ ...form, ingredients: ingredientsArr, nutrition: getNutritionObj(form) });
      }
      setForm(emptyRecipe);
      setEditingId(null);
      setShowForm(false);
      fetchRecipes();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not connect to the server. Please try again later.');
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

  const handleLike = async (id) => {
    await likeRecipeApi(id);
    setRecommended(recommended.filter(r => r._id !== id));
  };
  const handleDislike = async (id) => {
    await dislikeRecipeApi(id);
    setRecommended(recommended.filter(r => r._id !== id));
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
      {(!user) ? (
        <div className="error-msg">Please login to view your data.</div>
      ) : (
        <>
          <div className="recipes-header">
            <h2>Recipes</h2>
            <button className="add-btn" onClick={() => { setShowForm(!showForm); setForm(emptyRecipe); setEditingId(null); }}>
              {showForm ? 'Close' : 'Add Recipe'}
            </button>
          </div>
          {recommended.length > 0 && (
            <div className="recommended-section">
              <h3>Recommended for You</h3>
              <div className="recipe-cards">
                {recommended.map(r => (
                  <div className="recipe-card" key={r._id}>
                    <div className="card-header">
                      <h3>{r.title}</h3>
                    </div>
                    <div className="card-section">
                      <div className="section-header">
                        <span className="section-icon">🥕</span>
                        <strong>Ingredients</strong>
                      </div>
                      <ul className="ingredients-list">
                        {(r.ingredients && r.ingredients.map) ? r.ingredients.map((i, idx) => <li key={idx}>{i.name}</li>) : (r.ingredients || '').split(',').map((i, idx) => <li key={idx}>{i.trim()}</li>)}
                      </ul>
                    </div>
                    <div className="card-section">
                      <div className="section-header">
                        <span className="section-icon">📋</span>
                        <strong>Instructions</strong>
                      </div>
                      <div className="instructions">{r.instructions}</div>
                    </div>
                    <div className="feedback-btns">
                      <button className="like-btn" onClick={() => handleLike(r._id)}>Like 👍</button>
                      <button className="dislike-btn" onClick={() => handleDislike(r._id)}>Dislike 👎</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    <div className="section-header">
                      <span className="section-icon">🥕</span>
                      <strong>Ingredients</strong>
                    </div>
                    <ul className="ingredients-list">
                      {(r.ingredients && r.ingredients.map) ? r.ingredients.map((i, idx) => <li key={idx}>{i.name}</li>) : (r.ingredients || '').split(',').map((i, idx) => <li key={idx}>{i.trim()}</li>)}
                    </ul>
                  </div>
                  <div className="card-section">
                    <div className="section-header">
                      <span className="section-icon">📋</span>
                      <strong>Instructions</strong>
                    </div>
                    <div className="instructions">{r.instructions}</div>
                  </div>
                  <div className="card-section nutrition">
                    <div className="section-header">
                      <span className="section-icon">🍽️</span>
                      <strong>Nutrition Facts</strong>
                    </div>
                    <div className="nutrition-grid">
                      <div className="nutrition-item">
                        <span className="nutrition-icon">🔥</span>
                        <span className="nutrition-label">Calories:</span>
                        <span className="nutrition-value">{r.nutrition?.calories || 0}</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-icon">🥩</span>
                        <span className="nutrition-label">Protein:</span>
                        <span className="nutrition-value">{r.nutrition?.protein || 0}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-icon">🍞</span>
                        <span className="nutrition-label">Carbs:</span>
                        <span className="nutrition-value">{r.nutrition?.carbs || 0}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-icon">🧈</span>
                        <span className="nutrition-label">Fat:</span>
                        <span className="nutrition-value">{r.nutrition?.fat || 0}g</span>
                      </div>
                    </div>
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
        </>
      )}
    </div>
  );
};

export default Recipes; 