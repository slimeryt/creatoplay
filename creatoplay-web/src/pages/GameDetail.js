import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlay, FiThumbsUp, FiThumbsDown, FiServer, FiDownload } from 'react-icons/fi';
import './GameDetail.css';

const gamesData = {
  '1': { id: '1', title: 'Adopt Me!', description: 'Adopt pets and build your dream home!', likes: 95, visits: '32.5B', favorites: '28.5M', creator: 'DreamCraft', maxPlayers: 48 },
};

function GameDetail() {
  const { gameId } = useParams();
  const { userProfile } = useAuth();
  const [game, setGame] = useState(null);
  const [launching, setLaunching] = useState(false);
  const [serverIP, setServerIP] = useState(() => localStorage.getItem('serverIP') || '127.0.0.1');
  const [showServerInput, setShowServerInput] = useState(false);

  useEffect(() => {
    const data = gamesData[gameId] || {
      id: gameId,
      title: `Game ${gameId}`,
      description: 'An awesome game on Creatoplay!',
      likes: 85,
      visits: '1M',
      favorites: '50K',
      creator: 'Creator',
      maxPlayers: 20
    };
    setGame(data);
  }, [gameId]);

  const handlePlay = () => {
    setLaunching(true);
    const username = userProfile?.username || 'Guest';
    
    localStorage.setItem('serverIP', serverIP);
    
    const avatar = userProfile?.avatar || {};
    const head = (avatar.headColor || '#f5c469').replace('#', '');
    const torso = (avatar.torsoColor || '#4a90d9').replace('#', '');
    const arms = (avatar.armsColor || '#f5c469').replace('#', '');
    const legs = (avatar.legsColor || '#2d5a8a').replace('#', '');
    
    window.location.href = `creatoplay://play/${gameId}?user=${encodeURIComponent(username)}&server=${serverIP}&head=${head}&torso=${torso}&arms=${arms}&legs=${legs}`;
    setTimeout(() => {
      setLaunching(false);
    }, 1000);
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div className="game-detail">
      <div className="game-hero">
        <img src={`https://picsum.photos/seed/${gameId}/800/300`} alt="" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src={`https://picsum.photos/seed/${gameId}thumb/150/150`} alt="" className="game-thumb" />
          <div className="hero-info">
            <h1>{game.title}</h1>
            <p>By <Link to="/profile">{game.creator}</Link></p>
          </div>
          <div className="play-section">
            <button className="play-btn" onClick={handlePlay} disabled={launching}>
              <FiPlay /> {launching ? 'Launching...' : 'Play'}
            </button>
            <a href="https://github.com/slimeryt/creatoplay/releases/tag/V0.0.148-ALPHA" className="download-btn" title="Download Game">
              <FiDownload />
            </a>
            <button className="server-btn" onClick={() => setShowServerInput(!showServerInput)} title="Server Settings">
              <FiServer />
            </button>
          </div>
        </div>
      </div>

      {showServerInput && (
        <div className="server-input-box">
          <label>Server IP:</label>
          <input 
            type="text" 
            value={serverIP} 
            onChange={(e) => setServerIP(e.target.value)}
            placeholder="127.0.0.1"
          />
          <span className="server-hint">Use 127.0.0.1 for local, or friend's IP to join them</span>
        </div>
      )}

      <div className="game-content">
        <div className="game-main">
          <div className="game-tabs">
            <button className="tab active">About</button>
            <button className="tab">Servers</button>
            <button className="tab">Store</button>
          </div>
          <div className="game-about">
            <h3>Description</h3>
            <p>{game.description}</p>
          </div>
        </div>

        <div className="game-sidebar">
          <div className="stat-card">
            <div className="stat"><span>Active</span><strong>12.5K</strong></div>
            <div className="stat"><span>Favorites</span><strong>{game.favorites}</strong></div>
            <div className="stat"><span>Visits</span><strong>{game.visits}</strong></div>
            <div className="stat"><span>Max Players</span><strong>{game.maxPlayers}</strong></div>
          </div>
          <div className="rating-card">
            <button className="rate-btn"><FiThumbsUp /> Like</button>
            <button className="rate-btn"><FiThumbsDown /> Dislike</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;