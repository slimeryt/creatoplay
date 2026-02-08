import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiShoppingCart, FiGift, FiClock } from 'react-icons/fi';
import './Robux.css';

const ROBUX_PACKAGES = [
  { id: 1, amount: 400, bonus: 0, price: 4.99 },
  { id: 2, amount: 800, bonus: 0, price: 9.99 },
  { id: 3, amount: 1700, bonus: 0, price: 19.99 },
  { id: 4, amount: 4500, bonus: 0, price: 49.99 },
  { id: 5, amount: 10000, bonus: 0, price: 99.99, popular: true },
  { id: 6, amount: 22500, bonus: 0, price: 199.99 },
];

const PREMIUM_PLANS = [
  { id: 'p1', name: 'Premium 450', robux: 450, price: 4.99 },
  { id: 'p2', name: 'Premium 1000', robux: 1000, price: 9.99 },
  { id: 'p3', name: 'Premium 2200', robux: 2200, price: 19.99 },
];

function Robux() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const currentRobux = userProfile?.robux || 0;

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg);
    // In real app, this would open payment modal
    alert(`This is a demo. In production, this would purchase ${pkg.amount} Robux for $${pkg.price}`);
  };

  return (
    <div className="robux-page">
      <div className="robux-header">
        <div className="robux-balance">
          <FiDollarSign className="robux-icon" />
          <div>
            <span className="balance-label">Your Balance</span>
            <span className="balance-amount">{currentRobux.toLocaleString()} Robux</span>
          </div>
        </div>
      </div>

      <div className="robux-tabs">
        <button className={activeTab === 'buy' ? 'active' : ''} onClick={() => setActiveTab('buy')}>
          <FiShoppingCart /> Buy Robux
        </button>
        <button className={activeTab === 'premium' ? 'active' : ''} onClick={() => setActiveTab('premium')}>
          <FiGift /> Premium
        </button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          <FiClock /> History
        </button>
      </div>

      <div className="robux-content">
        {activeTab === 'buy' && (
          <>
            <h2>Buy Robux</h2>
            <p className="section-desc">Get Robux to purchase accessories, items, and more!</p>
            <div className="packages-grid">
              {ROBUX_PACKAGES.map((pkg) => (
                <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && <span className="popular-badge">Most Popular</span>}
                  <div className="package-amount">
                    <FiDollarSign />
                    <span>{pkg.amount.toLocaleString()}</span>
                  </div>
                  {pkg.bonus > 0 && <span className="package-bonus">+{pkg.bonus} Bonus</span>}
                  <button className="buy-btn" onClick={() => handlePurchase(pkg)}>
                    ${pkg.price}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'premium' && (
          <>
            <h2>Creatoplay Premium</h2>
            <p className="section-desc">Get monthly Robux and exclusive benefits!</p>
            <div className="premium-benefits">
              <h3>Premium Benefits:</h3>
              <ul>
                <li>Monthly Robux stipend</li>
                <li>Access to Premium-only items</li>
                <li>10% bonus Robux on purchases</li>
                <li>Trade items with other Premium members</li>
                <li>Premium badge on profile</li>
              </ul>
            </div>
            <div className="premium-grid">
              {PREMIUM_PLANS.map((plan) => (
                <div key={plan.id} className="premium-card">
                  <h3>{plan.name}</h3>
                  <div className="premium-robux">
                    <FiDollarSign />
                    <span>{plan.robux}</span>
                    <small>/month</small>
                  </div>
                  <button className="subscribe-btn" onClick={() => alert('Demo: Would subscribe to ' + plan.name)}>
                    ${plan.price}/mo
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <h2>Transaction History</h2>
            <div className="history-empty">
              <FiClock size={48} />
              <p>No transactions yet</p>
            </div>
          </>
        )}
      </div>

      <div className="robux-disclaimer">
        <p>Note: This is a demo platform. No real purchases can be made.</p>
      </div>
    </div>
  );
}

export default Robux;