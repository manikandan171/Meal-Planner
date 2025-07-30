import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../hooks/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const { user, logout } = useContext(AuthContext);
  const handleMenuToggle = () => setMenuOpen(m => !m);
  const handleLinkClick = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="user-profile" ref={dropdownRef}>
            <div className="profile-info" onClick={() => setDropdownOpen(d => !d)} style={{ cursor: 'pointer' }}>
              <span>{user.name}</span>
              <span style={{ fontSize: '1.1em', marginLeft: 4 }}>▼</span>
            </div>
            {dropdownOpen && (
              <div className="user-dropdown">
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { setDropdownOpen(false); handleLinkClick(); }}>Profile</NavLink>
                <button className="logout-btn" onClick={() => { handleLogout(); setDropdownOpen(false); }}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;