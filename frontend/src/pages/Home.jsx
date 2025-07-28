import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="home-container">
    <div className="home-hero">
      <div className="hero-icon">🍽️</div>
      <h1>Your Personalized Path to Healthier Eating</h1>
      <p>Make healthy eating simple, enjoyable, and tailored just for you!</p>
      <div className="home-actions">
        <Link to="/register" className="home-btn primary">Start Your Journey</Link>
        <Link to="/recipes" className="home-btn secondary">Explore Recipes</Link>
      </div>
    </div>
    
    <div className="home-features">
      <div className="home-feature">
        <div className="feature-icon">📋</div>
        <h3>Personalized Meal Plans</h3>
        <p>Build custom plans aligned with your goals, whether it's weight loss, muscle gain, or clean eating.</p>
        <Link to="/mealplanner" className="feature-link">Create Plan →</Link>
      </div>
      
      <div className="home-feature">
        <div className="feature-icon">🔍</div>
        <h3>Recipe Discovery</h3>
        <p>Explore a world of delicious, healthy recipes that match your taste and dietary needs.</p>
        <Link to="/recipes" className="feature-link">Browse Recipes →</Link>
      </div>
      
      <div className="home-feature">
        <div className="feature-icon">📊</div>
        <h3>Nutrition Tracking</h3>
        <p>Monitor your daily intake of calories, protein, carbs, and fat to stay on track.</p>
        <Link to="/nutrition" className="feature-link">Track Progress →</Link>
      </div>
      

    </div>
    
    <div className="home-cta">
      <h2>Ready to Transform Your Eating Habits?</h2>
      <p>Join thousands of users who have already discovered the joy of healthy, personalized meal planning.</p>
      <Link to="/register" className="cta-btn">Begin Your Transformation</Link>
    </div>
  </div>
);

export default Home;