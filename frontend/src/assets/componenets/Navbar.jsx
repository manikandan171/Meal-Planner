import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen(m => !m);
  const handleLinkClick = () => setMenuOpen(false);
  return (
    <nav className="navbar">
      <div className="navbar-logo">Smart Meal Planner</div>
      <div className="menu-icon" onClick={handleMenuToggle}>
        {menuOpen ? '✖' : '☰'}
      </div>
      <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Home</NavLink>
        <NavLink to="/recipes" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Recipes</NavLink>
        <NavLink to="/mealplanner" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Meal Planner</NavLink>
        <NavLink to="/nutrition" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Nutrition</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Login</NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Register</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;