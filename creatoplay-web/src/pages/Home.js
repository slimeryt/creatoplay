import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { FiChevronRight } from 'react-icons/fi';
import './Home.css';

const sampleGames = [
  { id: '1', title: 'Make a Beat & Donate 🎵', likes: 80 },
  { id: '2', title: '[30M] Dropper Incremental', likes: 92 },
  { id: '3', title: '[🐲 EVENT!] Tap Simulator ✨', likes: 95 },
  { id: '4', title: '[EVENT] BloxStrike', likes: 95 },
  { id: '5', title: 'BloxTube [BETA]', likes: 69 },
  { id: '6', title: '[UPDATE!] 🎃 ARISE 🎃', likes: 63 },
  { id: '7', title: '[💝 VALENTINE\'s!] Pet Simulator...', likes: 97 },
  { id: '8', title: '[EVENT + UPDATE 1] Omega Ra...', likes: 90 },
  { id: '9', title: '⚔️ Slay a Slime [BETA]', likes: 89 },
  { id: '10', title: 'Retail Tycoon 2', likes: 88 },
  { id: '11', title: '⛏️ Axia', likes: 95 },
  { id: '12', title: '💥 Destruction Simulator', likes: 92 },
];

const continueGames = [
  { id: '13', title: 'Build A Boat', likes: 91 },
  { id: '14', title: 'Jailbreak', likes: 89 },
  { id: '15', title: 'Murder Mystery 2', likes: 87 },
  { id: '16', title: 'Adopt Me!', likes: 95 },
  { id: '17', title: 'Blox Fruits', likes: 94 },
  { id: '18', title: 'Tower of Hell', likes: 86 },
  { id: '19', title: 'Arsenal', likes: 88 },
  { id: '20', title: 'Brookhaven', likes: 92 },
];

function Home() {
  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Home</h1>
      </div>

      {/* Recommended For You */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recommended For You</h2>
        </div>
        <div className="game-grid">
          {sampleGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Continue */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Continue</h2>
          <Link to="/discover" className="section-link">
            <FiChevronRight />
          </Link>
        </div>
        <div className="game-grid">
          {continueGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
