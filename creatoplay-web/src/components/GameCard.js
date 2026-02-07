import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiThumbsUp } from 'react-icons/fi';
import './GameCard.css';

function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div className="game-card" onClick={() => navigate(`/games/${game.id}`)}>
      <div className="game-thumbnail">
        <img 
          src={game.thumbnail || `https://picsum.photos/seed/${game.id}/200/200`} 
          alt={game.title}
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${game.id}/200/200`;
          }}
        />
      </div>
      <div className="game-info">
        <div className="game-title">{game.title}</div>
        <div className="game-rating">
          <FiThumbsUp />
          <span>{game.likes || 85}% Rating</span>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
