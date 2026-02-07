import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">CREATOPLAY</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/charts" className="nav-link">Charts</Link>
          <Link to="/discover" className="nav-link">Discover</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/robux" className="nav-link robux-link">Robux</Link>
        </div>
      </div>

      <div className="navbar-center">
        <form onSubmit={handleSearch} className="navbar-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-right">
        <Link to="/profile" className="user-link">
          <div className="user-avatar" style={{ backgroundColor: userProfile?.avatar?.headColor || '#4a90d9' }}>
            {userProfile?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="user-name">{userProfile?.username || 'User'}</span>
        </Link>

        <button className="icon-btn notification-btn">
          <FiBell />
          <span className="badge">1</span>
        </button>

        <div className="robux-display">
          <span className="robux-icon">R$</span>
          <span className="robux-amount">{userProfile?.robux || 0}</span>
        </div>

        <button className="icon-btn" onClick={() => setShowDropdown(!showDropdown)}>
          <FiSettings />
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
