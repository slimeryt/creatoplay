import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiSave, FiRotateCcw } from 'react-icons/fi';
import './Avatar.css';

const HATS = [
  { id: 'none', name: 'None', color: null },
  { id: 'cap', name: 'Cap', color: '#e74c3c' },
  { id: 'tophat', name: 'Top Hat', color: '#2c3e50' },
  { id: 'crown', name: 'Crown', color: '#f1c40f' },
  { id: 'beanie', name: 'Beanie', color: '#9b59b6' },
  { id: 'cowboy', name: 'Cowboy Hat', color: '#8b4513' },
];

const FACES = [
  { id: 'default', name: 'Default', emoji: '😊' },
  { id: 'happy', name: 'Happy', emoji: '😄' },
  { id: 'cool', name: 'Cool', emoji: '😎' },
  { id: 'angry', name: 'Angry', emoji: '😠' },
  { id: 'surprised', name: 'Surprised', emoji: '😮' },
  { id: 'wink', name: 'Wink', emoji: '😉' },
];

const COLOR_PRESETS = [
  '#f5c469', '#e8b04b', '#d4915c', '#a56839', '#754c24',
  '#ffffff', '#cccccc', '#888888', '#444444', '#000000',
  '#e74c3c', '#e91e63', '#9b59b6', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
];

function Avatar() {
  const { currentUser, userProfile } = useAuth();
  const [avatar, setAvatar] = useState({
    headColor: '#f5c469',
    torsoColor: '#4a90d9',
    armsColor: '#f5c469',
    legsColor: '#2d5a8a',
    hat: 'none',
    hatColor: '#e74c3c',
    face: 'default',
  });
  const [activeTab, setActiveTab] = useState('body');
  const [activePart, setActivePart] = useState('head');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userProfile?.avatar) {
      setAvatar({ ...avatar, ...userProfile.avatar });
    }
  }, [userProfile]);

  const handleColorChange = (color) => {
    if (activeTab === 'body') {
      if (activePart === 'head') setAvatar({ ...avatar, headColor: color });
      else if (activePart === 'torso') setAvatar({ ...avatar, torsoColor: color });
      else if (activePart === 'arms') setAvatar({ ...avatar, armsColor: color });
      else if (activePart === 'legs') setAvatar({ ...avatar, legsColor: color });
    } else if (activeTab === 'hats') {
      setAvatar({ ...avatar, hatColor: color });
    }
  };

  const handleHatChange = (hatId) => {
    setAvatar({ ...avatar, hat: hatId });
  };

  const handleFaceChange = (faceId) => {
    setAvatar({ ...avatar, face: faceId });
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { avatar });
      setMessage('Avatar saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving avatar:', error);
      setMessage('Error saving avatar');
    }
    setSaving(false);
  };

  const handleReset = () => {
    setAvatar({
      headColor: '#f5c469',
      torsoColor: '#4a90d9',
      armsColor: '#f5c469',
      legsColor: '#2d5a8a',
      hat: 'none',
      hatColor: '#e74c3c',
      face: 'default',
    });
  };

  const getFaceStyle = () => {
    const face = FACES.find(f => f.id === avatar.face) || FACES[0];
    return face.emoji;
  };

  return (
    <div className="avatar-page">
      <div className="avatar-preview">
        <h2>Your Avatar</h2>
        <div className="avatar-display">
          {/* Hat */}
          {avatar.hat !== 'none' && (
            <div className={`avatar-hat hat-${avatar.hat}`} style={{ backgroundColor: avatar.hatColor }}></div>
          )}
          {/* Head */}
          <div className="avatar-head" style={{ backgroundColor: avatar.headColor }}>
            <span className="avatar-face">{getFaceStyle()}</span>
          </div>
          {/* Torso */}
          <div className="avatar-torso" style={{ backgroundColor: avatar.torsoColor }}></div>
          {/* Arms */}
          <div className="avatar-arm left" style={{ backgroundColor: avatar.armsColor }}></div>
          <div className="avatar-arm right" style={{ backgroundColor: avatar.armsColor }}></div>
          {/* Legs */}
          <div className="avatar-leg left" style={{ backgroundColor: avatar.legsColor }}></div>
          <div className="avatar-leg right" style={{ backgroundColor: avatar.legsColor }}></div>
        </div>
        <div className="avatar-actions">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="reset-btn" onClick={handleReset}>
            <FiRotateCcw /> Reset
          </button>
        </div>
        {message && <div className="avatar-message">{message}</div>}
      </div>

      <div className="avatar-editor">
        <div className="editor-tabs">
          <button className={activeTab === 'body' ? 'active' : ''} onClick={() => setActiveTab('body')}>Body</button>
          <button className={activeTab === 'hats' ? 'active' : ''} onClick={() => setActiveTab('hats')}>Hats</button>
          <button className={activeTab === 'faces' ? 'active' : ''} onClick={() => setActiveTab('faces')}>Faces</button>
        </div>

        {activeTab === 'body' && (
          <div className="editor-section">
            <h3>Select Body Part</h3>
            <div className="body-parts">
              <button className={activePart === 'head' ? 'active' : ''} onClick={() => setActivePart('head')}>
                <div className="part-preview" style={{ backgroundColor: avatar.headColor }}></div>
                Head
              </button>
              <button className={activePart === 'torso' ? 'active' : ''} onClick={() => setActivePart('torso')}>
                <div className="part-preview" style={{ backgroundColor: avatar.torsoColor }}></div>
                Torso
              </button>
              <button className={activePart === 'arms' ? 'active' : ''} onClick={() => setActivePart('arms')}>
                <div className="part-preview" style={{ backgroundColor: avatar.armsColor }}></div>
                Arms
              </button>
              <button className={activePart === 'legs' ? 'active' : ''} onClick={() => setActivePart('legs')}>
                <div className="part-preview" style={{ backgroundColor: avatar.legsColor }}></div>
                Legs
              </button>
            </div>
            <h3>Select Color</h3>
            <div className="color-grid">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  className="color-btn"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                ></button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hats' && (
          <div className="editor-section">
            <h3>Select Hat</h3>
            <div className="item-grid">
              {HATS.map((hat) => (
                <button
                  key={hat.id}
                  className={`item-btn ${avatar.hat === hat.id ? 'active' : ''}`}
                  onClick={() => handleHatChange(hat.id)}
                >
                  <div className={`hat-preview hat-${hat.id}`} style={{ backgroundColor: hat.color || 'transparent' }}></div>
                  <span>{hat.name}</span>
                </button>
              ))}
            </div>
            {avatar.hat !== 'none' && (
              <>
                <h3>Hat Color</h3>
                <div className="color-grid">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${avatar.hatColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'faces' && (
          <div className="editor-section">
            <h3>Select Face</h3>
            <div className="item-grid faces">
              {FACES.map((face) => (
                <button
                  key={face.id}
                  className={`item-btn face-btn ${avatar.face === face.id ? 'active' : ''}`}
                  onClick={() => handleFaceChange(face.id)}
                >
                  <span className="face-emoji">{face.emoji}</span>
                  <span>{face.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;