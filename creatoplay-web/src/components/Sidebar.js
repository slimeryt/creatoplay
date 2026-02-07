import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiUser, FiMail, FiUsers, FiBox, FiShoppingBag, 
  FiRepeat, FiMessageSquare, FiFileText, FiStar, FiShoppingCart, FiGift
} from 'react-icons/fi';
import { IoGameController } from 'react-icons/io5';
import './Sidebar.css';

function Sidebar() {
  const { userProfile } = useAuth();

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Home' },
    { path: '/profile', icon: <FiUser />, label: 'Profile' },
    { path: '/messages', icon: <FiMail />, label: 'Messages', badge: 1 },
    { path: '/friends', icon: <FiUsers />, label: 'Friends', badge: 18 },
    { path: '/avatar', icon: <IoGameController />, label: 'Avatar' },
    { path: '/inventory', icon: <FiBox />, label: 'Inventory' },
    { path: '/trade', icon: <FiRepeat />, label: 'Trade' },
    { path: '/groups', icon: <FiMessageSquare />, label: 'Groups' },
    { path: '/blog', icon: <FiFileText />, label: 'Blog' },
    { path: '/store', icon: <FiShoppingCart />, label: 'Official Store' },
    { path: '/giftcards', icon: <FiGift />, label: 'Buy Gift Cards' },
  ];

  return (
    <aside className="sidebar">
      {/* User Profile at Top */}
      <div className="sidebar-user">
        <div 
          className="sidebar-avatar"
          style={{ backgroundColor: userProfile?.avatar?.headColor || '#4a90d9' }}
        >
          {userProfile?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="sidebar-username">{userProfile?.username || 'User'}</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-premium">
        <button className="premium-btn">Premium</button>
      </div>
    </aside>
  );
}

export default Sidebar;
