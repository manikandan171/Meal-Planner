import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../hooks/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const handleMenuToggle = () => setMenuOpen(m => !m);
  const handleLinkClick = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };
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
        {!user ? (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>Register</NavLink>
          </>
        ) : (
          <div className="user-profile">
            <div className="profile-info">
              <span>{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;