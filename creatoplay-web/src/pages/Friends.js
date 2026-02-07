import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import './Friends.css';

function Friends() {
  const { userProfile } = useAuth();
  const [tab, setTab] = useState('friends');
  const [search, setSearch] = useState('');

  return (
    <div className="friends-page">
      <h1>Friends</h1>

      <div className="friends-layout">
        <div className="friends-sidebar">
          <button className={`sidebar-btn ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>
            Friends <span>{userProfile?.friends?.length || 0}</span>
          </button>
          <button className={`sidebar-btn ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
            Requests <span>{userProfile?.friendRequests?.length || 0}</span>
          </button>
          <button className={`sidebar-btn ${tab === 'find' ? 'active' : ''}`} onClick={() => setTab('find')}>
            <FiUserPlus /> Find Friends
          </button>
        </div>

        <div className="friends-content">
          <div className="search-bar">
            <FiSearch />
            <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {tab === 'friends' && (
            <div className="empty-msg">No friends yet. Start by searching for players!</div>
          )}

          {tab === 'requests' && (
            <div className="empty-msg">No pending requests.</div>
          )}

          {tab === 'find' && (
            <div className="empty-msg">Search for players by username.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;
