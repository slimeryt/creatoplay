import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiUser, 
  FiMail, 
  FiUsers, 
  FiBox, 
  FiRepeat, 
  FiStar,
  FiShoppingBag,
  FiEdit3,
  FiFileText,
  FiGift
} from 'react-icons/fi';
import './Sidebar.css';

function Sidebar() {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar" style={{ backgroundColor: userProfile?.avatar?.torsoColor || '#4a90d9' }}>
          {userProfile?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="profile-name">{userProfile?.username || 'User'}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiHome /> Home
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiUser /> Profile
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiMail /> Messages
          {userProfile?.unreadMessages > 0 && (
            <span className="badge">{userProfile.unreadMessages}</span>
          )}
        </NavLink>
        <NavLink to="/friends" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiUsers /> Friends
          {userProfile?.friendRequests?.length > 0 && (
            <span className="badge">{userProfile.friendRequests.length}</span>
          )}
        </NavLink>
        <NavLink to="/avatar" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiStar /> Avatar
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiBox /> Inventory
        </NavLink>
        <NavLink to="/trade" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiRepeat /> Trade
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiUsers /> Groups
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiFileText /> Blog
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiShoppingBag /> Official Store
        </NavLink>
        <NavLink to="/robux" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiGift /> Buy Robux
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/robux" className="premium-btn">
          Premium
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;