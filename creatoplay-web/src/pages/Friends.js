import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FiUserPlus, FiUserMinus, FiPlay, FiSearch, FiUsers, FiUserCheck, FiX, FiCheck } from 'react-icons/fi';
import './Friends.css';

function Friends() {
  const { currentUser, userProfile } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load friends and friend requests
  useEffect(() => {
    if (userProfile) {
      loadFriends();
      loadFriendRequests();
    }
  }, [userProfile]);

  const loadFriends = async () => {
    if (!userProfile?.friends || userProfile.friends.length === 0) {
      setFriends([]);
      return;
    }

    const friendsList = [];
    for (const friendId of userProfile.friends) {
      const friendDoc = await getDoc(doc(db, 'users', friendId));
      if (friendDoc.exists()) {
        friendsList.push({ id: friendId, ...friendDoc.data() });
      }
    }
    setFriends(friendsList);
  };

  const loadFriendRequests = async () => {
    if (!userProfile?.friendRequests || userProfile.friendRequests.length === 0) {
      setFriendRequests([]);
      return;
    }

    const requestsList = [];
    for (const requesterId of userProfile.friendRequests) {
      const requesterDoc = await getDoc(doc(db, 'users', requesterId));
      if (requesterDoc.exists()) {
        requestsList.push({ id: requesterId, ...requesterDoc.data() });
      }
    }
    setFriendRequests(requestsList);
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', searchQuery.trim()));
      const snapshot = await getDocs(q);

      const results = [];
      snapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      setSearchResults(results);
      if (results.length === 0) {
        setMessage('No users found');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Search error:', error);
    }

    setLoading(false);
  };

  const sendFriendRequest = async (userId) => {
    try {
      // Add to their friendRequests array
      await updateDoc(doc(db, 'users', userId), {
        friendRequests: arrayUnion(currentUser.uid)
      });
      setMessage('Friend request sent!');
      setTimeout(() => setMessage(''), 3000);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const acceptFriendRequest = async (requesterId) => {
    try {
      // Add each other as friends
      await updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayUnion(requesterId),
        friendRequests: arrayRemove(requesterId)
      });
      await updateDoc(doc(db, 'users', requesterId), {
        friends: arrayUnion(currentUser.uid)
      });

      setMessage('Friend added!');
      setTimeout(() => setMessage(''), 3000);
      loadFriends();
      loadFriendRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const declineFriendRequest = async (requesterId) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        friendRequests: arrayRemove(requesterId)
      });
      loadFriendRequests();
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      // Remove from both users
      await updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayRemove(friendId)
      });
      await updateDoc(doc(db, 'users', friendId), {
        friends: arrayRemove(currentUser.uid)
      });

      setMessage('Friend removed');
      setTimeout(() => setMessage(''), 3000);
      loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const joinFriend = (friend) => {
    // Launch game with friend's server (for now, default server)
    const username = userProfile?.username || 'Guest';
    const avatar = userProfile?.avatar || {};
    const head = (avatar.headColor || '#f5c469').replace('#', '');
    const torso = (avatar.torsoColor || '#4a90d9').replace('#', '');
    const arms = (avatar.armsColor || '#f5c469').replace('#', '');
    const legs = (avatar.legsColor || '#2d5a8a').replace('#', '');

    window.location.href = `creatoplay://play/1?user=${encodeURIComponent(username)}&server=127.0.0.1&head=${head}&torso=${torso}&arms=${arms}&legs=${legs}`;
  };

  const isAlreadyFriend = (userId) => {
    return userProfile?.friends?.includes(userId);
  };

  const hasPendingRequest = (userId) => {
    return userProfile?.friendRequests?.includes(userId);
  };

  return (
    <div className="friends-page">
      <div className="friends-sidebar">
        <button 
          className={`sidebar-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <FiUsers /> Friends {friends.length > 0 && `(${friends.length})`}
        </button>
        <button 
          className={`sidebar-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <FiUserCheck /> Requests {friendRequests.length > 0 && <span className="badge">{friendRequests.length}</span>}
        </button>
        <button 
          className={`sidebar-btn ${activeTab === 'find' ? 'active' : ''}`}
          onClick={() => setActiveTab('find')}
        >
          <FiUserPlus /> Find Friends
        </button>
      </div>

      <div className="friends-content">
        {message && <div className="message-toast">{message}</div>}

        {activeTab === 'friends' && (
          <>
            <h2>Friends</h2>
            {friends.length === 0 ? (
              <div className="empty-state">
                <FiUsers size={48} />
                <p>No friends yet</p>
                <button onClick={() => setActiveTab('find')}>Find Friends</button>
              </div>
            ) : (
              <div className="friends-list">
                {friends.map((friend) => (
                  <div key={friend.id} className="friend-card">
                    <div className="friend-avatar" style={{ backgroundColor: friend.avatar?.torsoColor || '#4a90d9' }}>
                      {friend.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="friend-info">
                      <span className="friend-name">{friend.username}</span>
                    </div>
                    <div className="friend-actions">
                      <button className="join-btn" onClick={() => joinFriend(friend)} title="Join Game">
                        <FiPlay /> Join
                      </button>
                      <button className="remove-btn" onClick={() => removeFriend(friend.id)} title="Remove Friend">
                        <FiUserMinus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            <h2>Friend Requests</h2>
            {friendRequests.length === 0 ? (
              <div className="empty-state">
                <FiUserCheck size={48} />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="friends-list">
                {friendRequests.map((requester) => (
                  <div key={requester.id} className="friend-card request">
                    <div className="friend-avatar" style={{ backgroundColor: requester.avatar?.torsoColor || '#4a90d9' }}>
                      {requester.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="friend-info">
                      <span className="friend-name">{requester.username}</span>
                      <span className="request-label">wants to be your friend</span>
                    </div>
                    <div className="friend-actions">
                      <button className="accept-btn" onClick={() => acceptFriendRequest(requester.id)}>
                        <FiCheck /> Accept
                      </button>
                      <button className="decline-btn" onClick={() => declineFriendRequest(requester.id)}>
                        <FiX /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'find' && (
          <>
            <h2>Find Friends</h2>
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              />
              <button onClick={searchUsers} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="friends-list">
                {searchResults.map((user) => (
                  <div key={user.id} className="friend-card">
                    <div className="friend-avatar" style={{ backgroundColor: user.avatar?.torsoColor || '#4a90d9' }}>
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="friend-info">
                      <span className="friend-name">{user.username}</span>
                    </div>
                    <div className="friend-actions">
                      {isAlreadyFriend(user.id) ? (
                        <span className="already-friend">Already Friends</span>
                      ) : (
                        <button className="add-btn" onClick={() => sendFriendRequest(user.id)}>
                          <FiUserPlus /> Add Friend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Friends;