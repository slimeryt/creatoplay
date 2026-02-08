import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiPackage, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Inventory.css';

// Same items as shop - in real app, this would be a shared constant or from Firebase
const ALL_ITEMS = [
  { id: 'hat_cap_red', name: 'Red Cap', category: 'hats', rarity: 'common', color: '#e74c3c' },
  { id: 'hat_cap_blue', name: 'Blue Cap', category: 'hats', rarity: 'common', color: '#3498db' },
  { id: 'hat_tophat', name: 'Top Hat', category: 'hats', rarity: 'rare', color: '#2c3e50' },
  { id: 'hat_crown', name: 'Golden Crown', category: 'hats', rarity: 'legendary', color: '#f1c40f' },
  { id: 'hat_beanie', name: 'Purple Beanie', category: 'hats', rarity: 'common', color: '#9b59b6' },
  { id: 'hat_cowboy', name: 'Cowboy Hat', category: 'hats', rarity: 'uncommon', color: '#8b4513' },
  { id: 'face_happy', name: 'Happy Face', category: 'faces', rarity: 'common', emoji: '😄' },
  { id: 'face_cool', name: 'Cool Shades', category: 'faces', rarity: 'uncommon', emoji: '😎' },
  { id: 'face_angry', name: 'Angry Face', category: 'faces', rarity: 'common', emoji: '😠' },
  { id: 'face_surprised', name: 'Surprised Face', category: 'faces', rarity: 'common', emoji: '😮' },
  { id: 'face_wink', name: 'Wink Face', category: 'faces', rarity: 'uncommon', emoji: '😉' },
  { id: 'face_star', name: 'Star Eyes', category: 'faces', rarity: 'epic', emoji: '🤩' },
  { id: 'acc_wings_white', name: 'Angel Wings', category: 'accessories', rarity: 'epic', color: '#ffffff' },
  { id: 'acc_wings_dark', name: 'Dark Wings', category: 'accessories', rarity: 'epic', color: '#1a1a1a' },
  { id: 'acc_backpack', name: 'Backpack', category: 'accessories', rarity: 'common', color: '#27ae60' },
  { id: 'acc_cape_red', name: 'Red Cape', category: 'accessories', rarity: 'rare', color: '#e74c3c' },
  { id: 'gear_sword', name: 'Steel Sword', category: 'gear', rarity: 'uncommon', color: '#95a5a6' },
  { id: 'gear_sword_gold', name: 'Golden Sword', category: 'gear', rarity: 'legendary', color: '#f1c40f' },
  { id: 'gear_shield', name: 'Knight Shield', category: 'gear', rarity: 'rare', color: '#3498db' },
  { id: 'gear_staff', name: 'Magic Staff', category: 'gear', rarity: 'epic', color: '#9b59b6' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'hats', name: 'Hats' },
  { id: 'faces', name: 'Faces' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'gear', name: 'Gear' },
];

function Inventory() {
  const { currentUser, userProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState('');

  const ownedItemIds = userProfile?.inventory || [];
  const equippedItems = userProfile?.equipped || {};

  // Get full item details for owned items
  const ownedItems = ALL_ITEMS.filter(item => ownedItemIds.includes(item.id));

  const filteredItems = ownedItems.filter(item => {
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

  const handleEquip = async (item) => {
    if (!currentUser) return;
    
    try {
      const newEquipped = { ...equippedItems };
      
      // Equip by category
      if (item.category === 'hats') newEquipped.hat = item.id;
      else if (item.category === 'faces') newEquipped.face = item.id;
      else if (item.category === 'accessories') newEquipped.accessory = item.id;
      else if (item.category === 'gear') newEquipped.gear = item.id;

      await updateDoc(doc(db, 'users', currentUser.uid), {
        equipped: newEquipped
      });

      setMessage(`Equipped ${item.name}!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error equipping item:', err);
    }
  };

  const handleUnequip = async (category) => {
    if (!currentUser) return;
    
    try {
      const newEquipped = { ...equippedItems };
      delete newEquipped[category];

      await updateDoc(doc(db, 'users', currentUser.uid), {
        equipped: newEquipped
      });

      setMessage('Item unequipped');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error unequipping item:', err);
    }
  };

  const isEquipped = (item) => {
    if (item.category === 'hats') return equippedItems.hat === item.id;
    if (item.category === 'faces') return equippedItems.face === item.id;
    if (item.category === 'accessories') return equippedItems.accessory === item.id;
    if (item.category === 'gear') return equippedItems.gear === item.id;
    return false;
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
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="inventory-content">
        {message && <div className="inventory-message">{message}</div>}
        
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

        {ownedItems.length === 0 ? (
          <div className="empty-inventory">
            <FiPackage size={48} />
            <h3>No items yet</h3>
            <p>Visit the shop to get some items!</p>
            <Link to="/shop" className="shop-link">Go to Shop</Link>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-inventory">
            <FiSearch size={48} />
            <h3>No items found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className={`items-grid ${viewMode}`}>
            {filteredItems.map((item) => {
              const equipped = isEquipped(item);
              return (
                <div
                  key={item.id}
                  className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''} ${equipped ? 'equipped' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {equipped && <span className="equipped-badge">Equipped</span>}
                  <div className="item-image" style={{ backgroundColor: item.color || '#333' }}>
                    {item.emoji ? (
                      <span className="item-emoji">{item.emoji}</span>
                    ) : (
                      <span className="item-letter">{item.name[0]}</span>
                    )}
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                      {item.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="item-details">
          <div className="details-header">
            <h3>Item Details</h3>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
          </div>
          <div className="details-image" style={{ backgroundColor: selectedItem.color || '#333' }}>
            {selectedItem.emoji ? (
              <span className="details-emoji">{selectedItem.emoji}</span>
            ) : (
              <span className="details-letter">{selectedItem.name[0]}</span>
            )}
          </div>
          <div className="details-info">
            <h4>{selectedItem.name}</h4>
            <span className="details-rarity" style={{ color: getRarityColor(selectedItem.rarity) }}>
              {selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1)}
            </span>
            <p className="details-category">Category: {selectedItem.category}</p>
          </div>
          <div className="details-actions">
            {isEquipped(selectedItem) ? (
              <button className="unequip-btn" onClick={() => handleUnequip(
                selectedItem.category === 'hats' ? 'hat' :
                selectedItem.category === 'faces' ? 'face' :
                selectedItem.category === 'accessories' ? 'accessory' : 'gear'
              )}>
                Unequip
              </button>
            ) : (
              <button className="equip-btn" onClick={() => handleEquip(selectedItem)}>
                Equip
              </button>
            )}
            <Link to="/trade" className="trade-btn">Trade</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;