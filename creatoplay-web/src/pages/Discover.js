import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { FiSearch } from 'react-icons/fi';
import './Discover.css';

const allGames = [
  { id: '1', title: 'Adopt Me!', likes: 95, category: 'roleplay' },
  { id: '2', title: 'Brookhaven 🏡RP', likes: 92, category: 'roleplay' },
  { id: '3', title: 'Tower of Hell', likes: 89, category: 'obby' },
  { id: '4', title: 'Murder Mystery 2', likes: 91, category: 'adventure' },
  { id: '5', title: 'Blox Fruits', likes: 94, category: 'adventure' },
  { id: '6', title: 'Arsenal', likes: 88, category: 'shooter' },
  { id: '7', title: 'Jailbreak', likes: 90, category: 'adventure' },
  { id: '8', title: 'Royal High', likes: 93, category: 'roleplay' },
  { id: '9', title: 'Piggy', likes: 87, category: 'horror' },
  { id: '10', title: 'Pet Simulator X', likes: 91, category: 'simulator' },
  { id: '11', title: 'MeepCity', likes: 86, category: 'roleplay' },
  { id: '12', title: 'Work at a Pizza Place', likes: 84, category: 'tycoon' },
];

const categories = ['All', 'Popular', 'Adventure', 'Roleplay', 'Obby', 'Tycoon', 'Simulator'];

function Discover() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGames, setFilteredGames] = useState(allGames);

  useEffect(() => {
    let games = [...allGames];
    
    if (searchQuery) {
      games = games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (selectedCategory !== 'All' && selectedCategory !== 'Popular') {
      games = games.filter(g => g.category === selectedCategory.toLowerCase());
    }
    
    setFilteredGames(games);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1 className="page-title">Discover</h1>
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="game-grid">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <p className="no-results">No games found.</p>
      )}
    </div>
  );
}

export default Discover;
