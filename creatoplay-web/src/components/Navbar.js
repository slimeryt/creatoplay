import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiBell, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">Creatoplay</Link>
        <div className="nav-links">
          <Link to="/charts">Charts</Link>
          <Link to="/discover">Marketplace</Link>
          <Link to="/create">Create</Link>
          <Link to="/robux">Robux</Link>
        </div>
      </div>

      <div className="nav-center">
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <>
            <div className="profile-dropdown" onMouseLeave={() => setShowDropdown(false)}>
              <button className="profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="profile-avatar" style={{ backgroundColor: userProfile?.avatar?.torsoColor || '#4a90d9' }}>
                  {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="profile-name">{userProfile?.username || 'User'}</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    <FiUser /> Profile
                  </Link>
                  <Link to="/avatar" onClick={() => setShowDropdown(false)}>
                    <FiUser /> Avatar
                  </Link>
                  <Link to="/friends" onClick={() => setShowDropdown(false)}>
                    <FiUser /> Friends
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout}>
                    <FiLogOut /> Log Out
                  </button>
                </div>
              )}
            </div>
            <button className="nav-icon-btn notification-btn">
              <FiBell />
              <span className="notification-badge">1</span>
            </button>
            <Link to="/robux" className="robux-display">
              <span className="robux-icon">R$</span>
              <span>{userProfile?.robux || 0}</span>
            </Link>
            <Link to="/settings" className="nav-icon-btn">
              <FiSettings />
            </Link>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/register" className="signup-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;