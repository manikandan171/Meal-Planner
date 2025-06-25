import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="home-container">
    <div className="home-hero">
      <h1>Welcome to Smart Meal Planner</h1>
      <p>Your all-in-one solution for planning meals, tracking nutrition, and discovering new recipes. Make healthy eating easy and fun!</p>
      <div className="home-actions">
        <Link to="/register" className="home-btn">Get Started</Link>
        <Link to="/recipes" className="home-btn secondary">Browse Recipes</Link>
      </div>
    </div>
    <div className="home-features">
      <div className="home-feature">
        <h3>Personalized Meal Plans</h3>
        <p>Create meal plans tailored to your dietary preferences and goals.</p>
      </div>
      <div className="home-feature">
        <h3>Recipe Discovery</h3>
        <p>Find and save delicious recipes for every occasion and diet.</p>
      </div>
      <div className="home-feature">
        <h3>Nutrition Tracking</h3>
        <p>Track calories, protein, carbs, and more to stay on top of your health.</p>
      </div>
      <div className="home-feature">
        <h3>Easy to Use</h3>
        <p>Modern, responsive design for a seamless experience on any device.</p>
      </div>
    </div>
  </div>
);

export default Home;