import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiSave } from 'react-icons/fi';
import './Avatar.css';

const colors = [
  '#f5c469', '#e8b04b', '#c4914f', '#a67c52', '#8b6940',
  '#ffffff', '#c4c4c4', '#6b6b6b', '#3d3d3d',
  '#ff6b6b', '#d64545', '#a52828',
  '#4ecdc4', '#2d8a7e',
  '#45b7d1', '#1f73a4',
  '#96ceb4', '#43aa66',
  '#dda0dd', '#aa4faa',
];

const parts = [
  { id: 'headColor', label: 'Head' },
  { id: 'torsoColor', label: 'Torso' },
  { id: 'armsColor', label: 'Arms' },
  { id: 'legsColor', label: 'Legs' },
];

function Avatar() {
  const { userProfile, updateUserProfile } = useAuth();
  const [avatar, setAvatar] = useState({ headColor: '#f5c469', torsoColor: '#4a90d9', armsColor: '#f5c469', legsColor: '#2d5a8a' });
  const [selected, setSelected] = useState('headColor');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile?.avatar) setAvatar(userProfile.avatar);
  }, [userProfile]);

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile({ avatar });
    setSaving(false);
    alert('Avatar saved!');
  };

  return (
    <div className="avatar-page">
      <div className="avatar-header">
        <h1>Avatar</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="avatar-editor">
        <div className="avatar-preview">
          <div className="character">
            <div className="part head" style={{ background: avatar.headColor }}></div>
            <div className="part torso" style={{ background: avatar.torsoColor }}></div>
            <div className="part arm left" style={{ background: avatar.armsColor }}></div>
            <div className="part arm right" style={{ background: avatar.armsColor }}></div>
            <div className="part leg left" style={{ background: avatar.legsColor }}></div>
            <div className="part leg right" style={{ background: avatar.legsColor }}></div>
          </div>
        </div>

        <div className="avatar-controls">
          <div className="part-selector">
            {parts.map((p) => (
              <button key={p.id} className={`part-btn ${selected === p.id ? 'active' : ''}`} onClick={() => setSelected(p.id)}>
                {p.label}
                <span className="color-dot" style={{ background: avatar[p.id] }}></span>
              </button>
            ))}
          </div>

          <div className="color-grid">
            {colors.map((c, i) => (
              <button key={i} className={`color-btn ${avatar[selected] === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setAvatar({ ...avatar, [selected]: c })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Avatar;
