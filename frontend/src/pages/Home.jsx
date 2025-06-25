import React from 'react';
import './Home.css';

const Home = () => (
  <div className="home-container">
    <h1>Welcome to Smart Meal Planner</h1>
    <p>Plan your meals, manage recipes, generate grocery lists, and track your nutrition—all in one place.</p>
    <div className="home-actions">
      <a href="/register" className="home-btn">Get Started</a>
      <a href="/login" className="home-btn secondary">Login</a>
    </div>
  </div>
);

export default Home;