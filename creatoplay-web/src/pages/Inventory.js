import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiGrid, FiList, FiSearch, FiStar } from 'react-icons/fi';
import './Inventory.css';

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: FiPackage },
  { id: 'hats', name: 'Hats', icon: FiStar },
  { id: 'faces', name: 'Faces', icon: FiStar },
  { id: 'shirts', name: 'Shirts', icon: FiStar },
  { id: 'pants', name: 'Pants', icon: FiStar },
  { id: 'accessories', name: 'Accessories', icon: FiStar },
  { id: 'gear', name: 'Gear', icon: FiStar },
];

// Demo items - in real app, fetch from Firebase
const DEMO_ITEMS = [
  { id: '1', name: 'Red Cap', category: 'hats', rarity: 'common', image: 'https://picsum.photos/seed/hat1/100/100' },
  { id: '2', name: 'Golden Crown', category: 'hats', rarity: 'legendary', image: 'https://picsum.photos/seed/hat2/100/100' },
  { id: '3', name: 'Top Hat', category: 'hats', rarity: 'rare', image: 'https://picsum.photos/seed/hat3/100/100' },
  { id: '4', name: 'Happy Face', category: 'faces', rarity: 'common', image: 'https://picsum.photos/seed/face1/100/100' },
  { id: '5', name: 'Cool Shades', category: 'faces', rarity: 'uncommon', image: 'https://picsum.photos/seed/face2/100/100' },
  { id: '6', name: 'Blue Shirt', category: 'shirts', rarity: 'common', image: 'https://picsum.photos/seed/shirt1/100/100' },
  { id: '7', name: 'Galaxy Hoodie', category: 'shirts', rarity: 'epic', image: 'https://picsum.photos/seed/shirt2/100/100' },
  { id: '8', name: 'Black Pants', category: 'pants', rarity: 'common', image: 'https://picsum.photos/seed/pants1/100/100' },
  { id: '9', name: 'Sword', category: 'gear', rarity: 'rare', image: 'https://picsum.photos/seed/gear1/100/100' },
  { id: '10', name: 'Wings', category: 'accessories', rarity: 'legendary', image: 'https://picsum.photos/seed/acc1/100/100' },
];

function Inventory() {
  const { userProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = DEMO_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="inventory-page">
      <div className="inventory-sidebar">
        <h2>Inventory</h2>
        <div className="category-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <cat.icon /> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="inventory-content">
        <div className="inventory-header">
          <div className="inventory-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="view-toggles">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
              <FiGrid />
            </button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
              <FiList />
            </button>
          </div>
        </div>

        <div className="inventory-stats">
          <span>{filteredItems.length} items</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-inventory">
            <FiPackage size={48} />
            <h3>No items found</h3>
            <p>Visit the marketplace to get some items!</p>
          </div>
        ) : (
          <div className={`items-grid ${viewMode}`}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                    {item.rarity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="item-details">
          <div className="details-header">
            <h3>Item Details</h3>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
          </div>
          <div className="details-image">
            <img src={selectedItem.image} alt={selectedItem.name} />
          </div>
          <div className="details-info">
            <h4>{selectedItem.name}</h4>
            <span className="details-rarity" style={{ color: getRarityColor(selectedItem.rarity) }}>
              {selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1)}
            </span>
            <p className="details-category">Category: {selectedItem.category}</p>
          </div>
          <div className="details-actions">
            <button className="equip-btn">Equip</button>
            <button className="trade-btn">Trade</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;