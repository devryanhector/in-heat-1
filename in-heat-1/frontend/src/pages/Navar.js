// src/components/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navar.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu on link click (for mobile)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>in-heat Treats</Link>
      </div>
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link
            to="/product"
            onClick={closeMenu}
            className={location.pathname === '/product' ? 'active-link' : ''}
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/checkout"
            onClick={closeMenu}
            className={location.pathname === '/checkout' ? 'active-link' : ''}
          >
            Cart
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            onClick={closeMenu}
            className={location.pathname === '/profile' ? 'active-link' : ''}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            onClick={closeMenu}
            className={location.pathname === '/login' ? 'active-link' : ''}
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
