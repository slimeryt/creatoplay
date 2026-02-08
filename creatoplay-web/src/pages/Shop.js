import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { FiShoppingBag, FiSearch, FiCheck } from 'react-icons/fi';
import './Shop.css';

const SHOP_ITEMS = [
  // Hats
  { id: 'hat_cap_red', name: 'Red Cap', category: 'hats', price: 50, rarity: 'common', color: '#e74c3c' },
  { id: 'hat_cap_blue', name: 'Blue Cap', category: 'hats', price: 50, rarity: 'common', color: '#3498db' },
  { id: 'hat_tophat', name: 'Top Hat', category: 'hats', price: 200, rarity: 'rare', color: '#2c3e50' },
  { id: 'hat_crown', name: 'Golden Crown', category: 'hats', price: 1000, rarity: 'legendary', color: '#f1c40f' },
  { id: 'hat_beanie', name: 'Purple Beanie', category: 'hats', price: 75, rarity: 'common', color: '#9b59b6' },
  { id: 'hat_cowboy', name: 'Cowboy Hat', category: 'hats', price: 150, rarity: 'uncommon', color: '#8b4513' },
  
  // Faces
  { id: 'face_happy', name: 'Happy Face', category: 'faces', price: 25, rarity: 'common', emoji: '😄' },
  { id: 'face_cool', name: 'Cool Shades', category: 'faces', price: 100, rarity: 'uncommon', emoji: '😎' },
  { id: 'face_angry', name: 'Angry Face', category: 'faces', price: 25, rarity: 'common', emoji: '😠' },
  { id: 'face_surprised', name: 'Surprised Face', category: 'faces', price: 25, rarity: 'common', emoji: '😮' },
  { id: 'face_wink', name: 'Wink Face', category: 'faces', price: 50, rarity: 'uncommon', emoji: '😉' },
  { id: 'face_star', name: 'Star Eyes', category: 'faces', price: 500, rarity: 'epic', emoji: '🤩' },
  
  // Accessories
  { id: 'acc_wings_white', name: 'Angel Wings', category: 'accessories', price: 750, rarity: 'epic', color: '#ffffff' },
  { id: 'acc_wings_dark', name: 'Dark Wings', category: 'accessories', price: 750, rarity: 'epic', color: '#1a1a1a' },
  { id: 'acc_backpack', name: 'Backpack', category: 'accessories', price: 100, rarity: 'common', color: '#27ae60' },
  { id: 'acc_cape_red', name: 'Red Cape', category: 'accessories', price: 300, rarity: 'rare', color: '#e74c3c' },
  
  // Gear
  { id: 'gear_sword', name: 'Steel Sword', category: 'gear', price: 200, rarity: 'uncommon', color: '#95a5a6' },
  { id: 'gear_sword_gold', name: 'Golden Sword', category: 'gear', price: 1500, rarity: 'legendary', color: '#f1c40f' },
  { id: 'gear_shield', name: 'Knight Shield', category: 'gear', price: 250, rarity: 'rare', color: '#3498db' },
  { id: 'gear_staff', name: 'Magic Staff', category: 'gear', price: 500, rarity: 'epic', color: '#9b59b6' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'hats', name: 'Hats' },
  { id: 'faces', name: 'Faces' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'gear', name: 'Gear' },
];

function Shop() {
  const { currentUser, userProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [buying, setBuying] = useState(null);

  const userRobux = userProfile?.robux || 0;
  const ownedItems = userProfile?.inventory || [];

  const filteredItems = SHOP_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9b59b6';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const handleBuy = async (item) => {
    if (!currentUser) return;
    
    if (ownedItems.includes(item.id)) {
      setError('You already own this item!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (userRobux < item.price) {
      setError('Not enough Robux!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setBuying(item.id);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        robux: userRobux - item.price,
        inventory: arrayUnion(item.id)
      });
      setMessage(`Purchased ${item.name}!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error purchasing item');
      setTimeout(() => setError(''), 3000);
    }
    setBuying(null);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1><FiShoppingBag /> Item Shop</h1>
        <div className="robux-balance">
          <span className="robux-icon">R$</span>
          <span>{userRobux.toLocaleString()}</span>
        </div>
      </div>

      {message && <div className="shop-message success">{message}</div>}
      {error && <div className="shop-message error">{error}</div>}

      <div className="shop-controls">
        <div className="shop-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? 'active' : ''}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="shop-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="shop-grid">
        {filteredItems.map((item) => {
          const owned = ownedItems.includes(item.id);
          return (
            <div key={item.id} className={`shop-item ${owned ? 'owned' : ''}`}>
              <div className="item-preview" style={{ backgroundColor: item.color || '#333' }}>
                {item.emoji ? (
                  <span className="item-emoji">{item.emoji}</span>
                ) : (
                  <span className="item-letter">{item.name[0]}</span>
                )}
              </div>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                  {item.rarity}
                </span>
              </div>
              {owned ? (
                <button className="buy-btn owned" disabled>
                  <FiCheck /> Owned
                </button>
              ) : (
                <button
                  className="buy-btn"
                  onClick={() => handleBuy(item)}
                  disabled={buying === item.id}
                >
                  <span className="robux-icon">R$</span> {item.price}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Shop;