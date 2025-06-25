import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">Smart Meal Planner</div>
    <div className="navbar-links">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
      <NavLink to="/recipes" className={({ isActive }) => isActive ? 'active' : ''}>Recipes</NavLink>
      <NavLink to="/mealplanner" className={({ isActive }) => isActive ? 'active' : ''}>Meal Planner</NavLink>
      <NavLink to="/grocery" className={({ isActive }) => isActive ? 'active' : ''}>Grocery List</NavLink>
      <NavLink to="/nutrition" className={({ isActive }) => isActive ? 'active' : ''}>Nutrition</NavLink>
      <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
      <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink>
    </div>
  </nav>
);

export default Navbar;