import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
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
        <Link to="/" className="nav-logo">
          <span className="logo-icon">C</span>
          <span className="logo-text">Creatoplay</span>
        </Link>
        <div className="nav-links">
          <Link to="/discover">Discover</Link>
          <Link to="/charts">Charts</Link>
          <Link to="/create">Create</Link>
          <Link to="/robux" className="robux-link">
            <span className="robux-icon">R$</span>
            <span>{userProfile?.robux || 0}</span>
          </Link>
        </div>
      </div>

      <div className="nav-center">
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder="Search games..." />
        </div>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <>
            <button className="nav-icon-btn">
              <FiBell />
            </button>
            <div className="profile-dropdown" onMouseLeave={() => setShowDropdown(false)}>
              <button className="profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="profile-avatar" style={{ backgroundColor: userProfile?.avatar?.torsoColor || '#4a90d9' }}>
                  {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="profile-name">{userProfile?.username || 'User'}</span>
                <FiChevronDown />
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
                  <Link to="/settings" onClick={() => setShowDropdown(false)}>
                    <FiSettings /> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout}>
                    <FiLogOut /> Log Out
                  </button>
                </div>
              )}
            </div>
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