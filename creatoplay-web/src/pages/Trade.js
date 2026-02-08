import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FiRefreshCw, FiSearch, FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import './Trade.css';

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

function Trade() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('trades');
  const [trades, setTrades] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [tradePartner, setTradePartner] = useState(null);
  const [selectedMyItems, setSelectedMyItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const myInventory = userProfile?.inventory || [];
  const myItems = ALL_ITEMS.filter(item => myInventory.includes(item.id));

  // Load trades
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'trades'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const tradesList = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        
        // Get other user info
        const otherUserId = data.fromId === currentUser.uid ? data.toId : data.fromId;
        const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
        const otherUser = otherUserDoc.exists() ? otherUserDoc.data() : { username: 'Unknown' };

        tradesList.push({
          id: docSnap.id,
          ...data,
          otherUser: { id: otherUserId, ...otherUser },
          isIncoming: data.toId === currentUser.uid
        });
      }
      
      // Sort by date
      tradesList.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setTrades(tradesList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getItemDetails = (itemId) => ALL_ITEMS.find(i => i.id === itemId);

  const handleSearchUser = async () => {
    if (!searchUser.trim()) return;

    try {
      const q = query(collection(db, 'users'), where('username', '==', searchUser.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('User not found');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const userDoc = snapshot.docs[0];
      if (userDoc.id === currentUser.uid) {
        setError("You can't trade with yourself!");
        setTimeout(() => setError(''), 3000);
        return;
      }

      setTradePartner({
        id: userDoc.id,
        ...userDoc.data()
      });
      setSelectedMyItems([]);
    } catch (err) {
      setError('Error searching user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleMyItem = (itemId) => {
    if (selectedMyItems.includes(itemId)) {
      setSelectedMyItems(selectedMyItems.filter(id => id !== itemId));
    } else {
      setSelectedMyItems([...selectedMyItems, itemId]);
    }
  };

  const handleSendTrade = async () => {
    if (!tradePartner || selectedMyItems.length === 0) return;

    try {
      await addDoc(collection(db, 'trades'), {
        fromId: currentUser.uid,
        fromName: userProfile?.username || 'Unknown',
        toId: tradePartner.id,
        toName: tradePartner.username,
        fromItems: selectedMyItems,
        toItems: [], // Other user will add their items when accepting
        status: 'pending',
        participants: [currentUser.uid, tradePartner.id],
        createdAt: serverTimestamp()
      });

      setMessage('Trade request sent!');
      setTimeout(() => setMessage(''), 3000);
      setTradePartner(null);
      setSelectedMyItems([]);
      setSearchUser('');
      setActiveTab('trades');
    } catch (err) {
      setError('Error sending trade');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAcceptTrade = async (trade) => {
    try {
      // Move items between users
      const fromUserRef = doc(db, 'users', trade.fromId);
      const toUserRef = doc(db, 'users', trade.toId);

      // Remove items from sender, add to receiver
      for (const itemId of trade.fromItems) {
        await updateDoc(fromUserRef, { inventory: arrayRemove(itemId) });
        await updateDoc(toUserRef, { inventory: arrayUnion(itemId) });
      }

      // Update trade status
      await updateDoc(doc(db, 'trades', trade.id), { status: 'completed' });

      setMessage('Trade completed!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error completing trade');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeclineTrade = async (trade) => {
    try {
      await updateDoc(doc(db, 'trades', trade.id), { status: 'declined' });
      setMessage('Trade declined');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error declining trade');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    try {
      await deleteDoc(doc(db, 'trades', tradeId));
    } catch (err) {
      console.error('Error deleting trade:', err);
    }
  };

  return (
    <div className="trade-page">
      <div className="trade-tabs">
        <button className={activeTab === 'trades' ? 'active' : ''} onClick={() => setActiveTab('trades')}>
          <FiRefreshCw /> My Trades
        </button>
        <button className={activeTab === 'new' ? 'active' : ''} onClick={() => setActiveTab('new')}>
          New Trade
        </button>
      </div>

      {message && <div className="trade-message success">{message}</div>}
      {error && <div className="trade-message error">{error}</div>}

      {activeTab === 'trades' && (
        <div className="trades-list">
          <h2>Trade History</h2>
          {trades.length === 0 ? (
            <div className="empty-trades">
              <FiRefreshCw size={48} />
              <h3>No trades yet</h3>
              <p>Start a new trade to exchange items!</p>
            </div>
          ) : (
            <div className="trades-grid">
              {trades.map((trade) => (
                <div key={trade.id} className={`trade-card ${trade.status}`}>
                  <div className="trade-status">
                    {trade.status === 'pending' && <span className="pending">{trade.isIncoming ? 'Incoming' : 'Pending'}</span>}
                    {trade.status === 'completed' && <span className="completed">Completed</span>}
                    {trade.status === 'declined' && <span className="declined">Declined</span>}
                  </div>
                  <div className="trade-content">
                    <div className="trade-side">
                      <span className="trade-user">{trade.fromName}</span>
                      <div className="trade-items">
                        {trade.fromItems.map((itemId) => {
                          const item = getItemDetails(itemId);
                          return item ? (
                            <div key={itemId} className="trade-item" style={{ backgroundColor: item.color || '#333' }}>
                              {item.emoji || item.name[0]}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="trade-arrow">
                      <FiArrowRight />
                    </div>
                    <div className="trade-side">
                      <span className="trade-user">{trade.toName}</span>
                      <div className="trade-items">
                        {trade.toItems?.length > 0 ? (
                          trade.toItems.map((itemId) => {
                            const item = getItemDetails(itemId);
                            return item ? (
                              <div key={itemId} className="trade-item" style={{ backgroundColor: item.color || '#333' }}>
                                {item.emoji || item.name[0]}
                              </div>
                            ) : null;
                          })
                        ) : (
                          <span className="no-items">Gift</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="trade-footer">
                    {trade.status === 'pending' && trade.isIncoming && (
                      <div className="trade-actions">
                        <button className="accept-btn" onClick={() => handleAcceptTrade(trade)}>
                          <FiCheck /> Accept
                        </button>
                        <button className="decline-btn" onClick={() => handleDeclineTrade(trade)}>
                          <FiX /> Decline
                        </button>
                      </div>
                    )}
                    {trade.status !== 'pending' && (
                      <button className="delete-btn" onClick={() => handleDeleteTrade(trade.id)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'new' && (
        <div className="new-trade">
          <h2>New Trade</h2>

          <div className="trade-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Enter username to trade with..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
            />
            <button onClick={handleSearchUser}>Search</button>
          </div>

          {tradePartner && (
            <div className="trade-builder">
              <div className="trade-partner-info">
                Trading with: <strong>{tradePartner.username}</strong>
              </div>

              <h3>Select items to offer:</h3>
              {myItems.length === 0 ? (
                <p className="no-items-msg">You don't have any items to trade</p>
              ) : (
                <div className="items-selector">
                  {myItems.map((item) => (
                    <div
                      key={item.id}
                      className={`selectable-item ${selectedMyItems.includes(item.id) ? 'selected' : ''}`}
                      onClick={() => toggleMyItem(item.id)}
                    >
                      <div className="item-icon" style={{ backgroundColor: item.color || '#333' }}>
                        {item.emoji || item.name[0]}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="send-trade-btn"
                onClick={handleSendTrade}
                disabled={selectedMyItems.length === 0}
              >
                Send Trade Request ({selectedMyItems.length} items)
              </button>
            </div>
          )}

          {!tradePartner && (
            <div className="no-partner">
              <FiSearch size={48} />
              <p>Search for a player to start trading</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Trade;