import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { FiUser, FiLock, FiBell, FiShield, FiSave, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Account settings
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowMessages: true,
    showInventory: true,
    showGames: true,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    friendRequests: true,
    messages: true,
    gameUpdates: true,
    newsletter: false,
  });

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '');
      setBio(userProfile.bio || '');
      if (userProfile.privacy) setPrivacy({ ...privacy, ...userProfile.privacy });
      if (userProfile.notifications) setNotifications({ ...notifications, ...userProfile.notifications });
    }
  }, [userProfile]);

  const showMessage = (msg) => {
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setMessage('');
    setTimeout(() => setError(''), 3000);
  };

  const handleSaveAccount = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        username,
        bio,
      });
      showMessage('Account settings saved!');
    } catch (err) {
      showError('Error saving settings');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage('Password changed successfully!');
    } catch (err) {
      showError('Error changing password. Check your current password.');
    }
    setSaving(false);
  };

  const handleSavePrivacy = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { privacy });
      showMessage('Privacy settings saved!');
    } catch (err) {
      showError('Error saving settings');
    }
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { notifications });
      showMessage('Notification settings saved!');
    } catch (err) {
      showError('Error saving settings');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <div className="settings-sidebar">
        <h2>Settings</h2>
        <button className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>
          <FiUser /> Account
        </button>
        <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
          <FiLock /> Security
        </button>
        <button className={activeTab === 'privacy' ? 'active' : ''} onClick={() => setActiveTab('privacy')}>
          <FiShield /> Privacy
        </button>
        <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
          <FiBell /> Notifications
        </button>
        <div className="sidebar-divider"></div>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Log Out
        </button>
      </div>

      <div className="settings-content">
        {message && <div className="settings-message success">{message}</div>}
        {error && <div className="settings-message error">{error}</div>}

        {activeTab === 'account' && (
          <div className="settings-section">
            <h3>Account Info</h3>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={currentUser?.email || ''} disabled />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4}></textarea>
            </div>
            <button className="save-btn" onClick={handleSaveAccount} disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className="save-btn" onClick={handleChangePassword} disabled={saving}>
              <FiLock /> {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="settings-section">
            <h3>Privacy Settings</h3>
            <div className="toggle-group">
              <label>
                <span>Show Online Status</span>
                <input type="checkbox" checked={privacy.showOnlineStatus} onChange={(e) => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Allow Friend Requests</span>
                <input type="checkbox" checked={privacy.allowFriendRequests} onChange={(e) => setPrivacy({ ...privacy, allowFriendRequests: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Allow Messages from Everyone</span>
                <input type="checkbox" checked={privacy.allowMessages} onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Show Inventory to Others</span>
                <input type="checkbox" checked={privacy.showInventory} onChange={(e) => setPrivacy({ ...privacy, showInventory: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Show My Games</span>
                <input type="checkbox" checked={privacy.showGames} onChange={(e) => setPrivacy({ ...privacy, showGames: e.target.checked })} />
              </label>
            </div>
            <button className="save-btn" onClick={handleSavePrivacy} disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h3>Notification Preferences</h3>
            <div className="toggle-group">
              <label>
                <span>Friend Requests</span>
                <input type="checkbox" checked={notifications.friendRequests} onChange={(e) => setNotifications({ ...notifications, friendRequests: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Messages</span>
                <input type="checkbox" checked={notifications.messages} onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Game Updates</span>
                <input type="checkbox" checked={notifications.gameUpdates} onChange={(e) => setNotifications({ ...notifications, gameUpdates: e.target.checked })} />
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <span>Newsletter</span>
                <input type="checkbox" checked={notifications.newsletter} onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })} />
              </label>
            </div>
            <button className="save-btn" onClick={handleSaveNotifications} disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Notification Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;