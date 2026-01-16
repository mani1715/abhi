import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { agencyInfo } from '../data/mock';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    { path: '/chat', label: 'Chat' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo with Image */}
        <Link to="/" className="navbar-logo" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          gap: '12px'
        }}>
          <img 
            src="/prompt-forge-logo.png" 
            alt="Prompt Forge Logo" 
            style={{
              height: '40px',
              objectFit: 'contain'
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="navbar-cta">
          <Link to="/contact">
            <Button className="nav-cta-button">Start Project</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            <Button className="mobile-cta-button">Start Project</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;