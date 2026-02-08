import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiRefreshCw, FiSearch, FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import './Trade.css';

// Demo data
const DEMO_TRADES = [
  {
    id: '1',
    status: 'pending',
    from: { name: 'Player123', items: [{ name: 'Golden Crown', image: 'https://picsum.photos/seed/t1/60/60' }] },
    to: { name: 'You', items: [{ name: 'Red Cap', image: 'https://picsum.photos/seed/t2/60/60' }] },
    date: '2 hours ago'
  },
  {
    id: '2',
    status: 'completed',
    from: { name: 'You', items: [{ name: 'Sword', image: 'https://picsum.photos/seed/t3/60/60' }] },
    to: { name: 'Gamer456', items: [{ name: 'Shield', image: 'https://picsum.photos/seed/t4/60/60' }] },
    date: 'Yesterday'
  },
];

const MY_ITEMS = [
  { id: '1', name: 'Red Cap', image: 'https://picsum.photos/seed/hat1/60/60' },
  { id: '2', name: 'Blue Shirt', image: 'https://picsum.photos/seed/shirt1/60/60' },
  { id: '3', name: 'Sword', image: 'https://picsum.photos/seed/gear1/60/60' },
  { id: '4', name: 'Cool Shades', image: 'https://picsum.photos/seed/face2/60/60' },
];

function Trade() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('trades');
  const [searchUser, setSearchUser] = useState('');
  const [selectedMyItems, setSelectedMyItems] = useState([]);
  const [selectedTheirItems, setSelectedTheirItems] = useState([]);
  const [tradePartner, setTradePartner] = useState(null);

  const toggleMyItem = (item) => {
    if (selectedMyItems.find(i => i.id === item.id)) {
      setSelectedMyItems(selectedMyItems.filter(i => i.id !== item.id));
    } else {
      setSelectedMyItems([...selectedMyItems, item]);
    }
  };

  const handleSearchUser = () => {
    if (searchUser.trim()) {
      setTradePartner({ name: searchUser, items: MY_ITEMS.slice(0, 2) });
    }
  };

  const handleSendTrade = () => {
    if (selectedMyItems.length > 0 && tradePartner) {
      alert(`Trade request sent to ${tradePartner.name}!`);
      setSelectedMyItems([]);
      setSelectedTheirItems([]);
      setTradePartner(null);
      setSearchUser('');
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

      {activeTab === 'trades' && (
        <div className="trades-list">
          <h2>Trade History</h2>
          {DEMO_TRADES.length === 0 ? (
            <div className="empty-trades">
              <FiRefreshCw size={48} />
              <h3>No trades yet</h3>
              <p>Start a new trade to exchange items with other players!</p>
            </div>
          ) : (
            <div className="trades-grid">
              {DEMO_TRADES.map((trade) => (
                <div key={trade.id} className={`trade-card ${trade.status}`}>
                  <div className="trade-status">
                    {trade.status === 'pending' && <span className="pending">Pending</span>}
                    {trade.status === 'completed' && <span className="completed">Completed</span>}
                    {trade.status === 'declined' && <span className="declined">Declined</span>}
                  </div>
                  <div className="trade-content">
                    <div className="trade-side">
                      <span className="trade-user">{trade.from.name}</span>
                      <div className="trade-items">
                        {trade.from.items.map((item, i) => (
                          <img key={i} src={item.image} alt={item.name} title={item.name} />
                        ))}
                      </div>
                    </div>
                    <div className="trade-arrow">
                      <FiArrowRight />
                    </div>
                    <div className="trade-side">
                      <span className="trade-user">{trade.to.name}</span>
                      <div className="trade-items">
                        {trade.to.items.map((item, i) => (
                          <img key={i} src={item.image} alt={item.name} title={item.name} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="trade-footer">
                    <span className="trade-date">{trade.date}</span>
                    {trade.status === 'pending' && (
                      <div className="trade-actions">
                        <button className="accept-btn"><FiCheck /> Accept</button>
                        <button className="decline-btn"><FiX /> Decline</button>
                      </div>
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
              placeholder="Search player to trade with..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
            />
            <button onClick={handleSearchUser}>Search</button>
          </div>

          {tradePartner && (
            <div className="trade-builder">
              <div className="trade-column">
                <h3>Your Items</h3>
                <div className="items-selector">
                  {MY_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={`selectable-item ${selectedMyItems.find(i => i.id === item.id) ? 'selected' : ''}`}
                      onClick={() => toggleMyItem(item)}
                    >
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trade-preview">
                <div className="preview-section">
                  <h4>You Give</h4>
                  <div className="preview-items">
                    {selectedMyItems.length === 0 ? (
                      <span className="no-items">Select items</span>
                    ) : (
                      selectedMyItems.map((item) => (
                        <img key={item.id} src={item.image} alt={item.name} title={item.name} />
                      ))
                    )}
                  </div>
                </div>
                <FiArrowRight className="preview-arrow" />
                <div className="preview-section">
                  <h4>{tradePartner.name} Gives</h4>
                  <div className="preview-items">
                    {selectedTheirItems.length === 0 ? (
                      <span className="no-items">Waiting...</span>
                    ) : (
                      selectedTheirItems.map((item) => (
                        <img key={item.id} src={item.image} alt={item.name} title={item.name} />
                      ))
                    )}
                  </div>
                </div>
              </div>

              <button
                className="send-trade-btn"
                onClick={handleSendTrade}
                disabled={selectedMyItems.length === 0}
              >
                Send Trade Request
              </button>
            </div>
          )}

          {!tradePartner && (
            <div className="no-partner">
              <FiSearch size={48} />
              <p>Search for a player to start a trade</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Trade;