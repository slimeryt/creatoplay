import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FiPlus, FiEdit2, FiTrash2, FiPlay, FiUsers, FiEye, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Create.css';

function Create() {
  const { currentUser, userProfile } = useAuth();
  const [myGames, setMyGames] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // New game form
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    maxPlayers: 20,
    genre: 'adventure',
  });

  useEffect(() => {
    if (currentUser) {
      loadMyGames();
    }
  }, [currentUser]);

  const loadMyGames = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'games'), where('creatorId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      const games = [];
      snapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });
      setMyGames(games);
    } catch (error) {
      console.error('Error loading games:', error);
    }
    setLoading(false);
  };

  const handleCreateGame = async () => {
    if (!newGame.title.trim()) {
      setMessage('Please enter a game title');
      return;
    }

    try {
      await addDoc(collection(db, 'games'), {
        ...newGame,
        creatorId: currentUser.uid,
        creatorName: userProfile?.username || 'Unknown',
        visits: 0,
        likes: 0,
        dislikes: 0,
        favorites: 0,
        active: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setShowCreateModal(false);
      setNewGame({ title: '', description: '', maxPlayers: 20, genre: 'adventure' });
      setMessage('Game created successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadMyGames();
    } catch (error) {
      console.error('Error creating game:', error);
      setMessage('Error creating game');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteDoc(doc(db, 'games', gameId));
        setMessage('Game deleted');
        setTimeout(() => setMessage(''), 3000);
        loadMyGames();
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  return (
    <div className="create-page">
      <div className="create-header">
        <div className="header-content">
          <h1>Game Studio</h1>
          <p>Create and manage your games</p>
        </div>
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          <FiPlus /> Create New Game
        </button>
      </div>

      {message && <div className="create-message">{message}</div>}

      <div className="create-stats">
        <div className="stat-box">
          <span className="stat-value">{myGames.length}</span>
          <span className="stat-label">My Games</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{myGames.reduce((sum, g) => sum + (g.visits || 0), 0)}</span>
          <span className="stat-label">Total Visits</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{myGames.reduce((sum, g) => sum + (g.likes || 0), 0)}</span>
          <span className="stat-label">Total Likes</span>
        </div>
      </div>

      <div className="games-section">
        <h2>My Games</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : myGames.length === 0 ? (
          <div className="empty-state">
            <FiPlay size={48} />
            <h3>No games yet</h3>
            <p>Create your first game to get started!</p>
            <button onClick={() => setShowCreateModal(true)}>
              <FiPlus /> Create Game
            </button>
          </div>
        ) : (
          <div className="games-grid">
            {myGames.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-thumbnail">
                  <img src={`https://picsum.photos/seed/${game.id}/300/180`} alt="" />
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <p>{game.description || 'No description'}</p>
                  <div className="game-stats">
                    <span><FiEye /> {game.visits || 0}</span>
                    <span><FiUsers /> {game.maxPlayers}</span>
                  </div>
                </div>
                <div className="game-actions">
                  <Link to={`/game/${game.id}`} className="action-btn play">
                    <FiPlay /> Play
                  </Link>
                  <button className="action-btn edit">
                    <FiEdit2 /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteGame(game.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="studio-download">
        <div className="download-content">
          <h2>Creatoplay Studio</h2>
          <p>Download our desktop app to build amazing games with our visual editor!</p>
          <a href="/CreatoplayStudio.zip" download className="download-btn">
            <FiDownload /> Download Studio
          </a>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Game</h2>
            <div className="form-group">
              <label>Game Title</label>
              <input
                type="text"
                value={newGame.title}
                onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                placeholder="Enter game title..."
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newGame.description}
                onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                placeholder="Describe your game..."
                rows={4}
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Players</label>
                <input
                  type="number"
                  value={newGame.maxPlayers}
                  onChange={(e) => setNewGame({ ...newGame, maxPlayers: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select value={newGame.genre} onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}>
                  <option value="adventure">Adventure</option>
                  <option value="roleplay">Roleplay</option>
                  <option value="tycoon">Tycoon</option>
                  <option value="simulator">Simulator</option>
                  <option value="obby">Obby</option>
                  <option value="fighting">Fighting</option>
                  <option value="horror">Horror</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleCreateGame}>Create Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;