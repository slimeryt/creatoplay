import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiUsers } from 'react-icons/fi';
import GameCard from '../components/GameCard';
import './Profile.css';

function Profile() {
  const { userId } = useParams();
  const { currentUser, userProfile, getUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isOwn, setIsOwn] = useState(false);
  const [tab, setTab] = useState('creations');

  useEffect(() => {
    const load = async () => {
      if (!userId || userId === currentUser?.uid) {
        setProfile(userProfile);
        setIsOwn(true);
      } else {
        const p = await getUserProfile(userId);
        setProfile(p);
        setIsOwn(false);
      }
    };
    load();
  }, [userId, currentUser, userProfile, getUserProfile]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-info">
          <div className="profile-avatar" style={{ backgroundColor: profile.avatar?.headColor || '#4a90d9' }}>
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div className="profile-details">
            <h1>@{profile.username}</h1>
            <p className="bio">{profile.bio || 'No bio'}</p>
            <div className="profile-meta">
              <span><FiUsers /> {profile.friends?.length || 0} Friends</span>
            </div>
          </div>
          {isOwn ? (
            <Link to="/avatar" className="btn btn-secondary"><FiEdit2 /> Edit Avatar</Link>
          ) : (
            <button className="btn btn-primary"><FiUsers /> Add Friend</button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`tab ${tab === 'creations' ? 'active' : ''}`} onClick={() => setTab('creations')}>Creations</button>
        <button className={`tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>Favorites</button>
      </div>

      <div className="profile-content">
        {tab === 'creations' && (
          <p className="empty-msg">No games created yet.</p>
        )}
        {tab === 'favorites' && (
          <p className="empty-msg">No favorite games yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
