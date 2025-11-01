import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useLocalStorage } from '../Hooks/useLocalStorage.jsx';
import { useBalance } from '../Balance/BalanceContext.jsx';
import { useHistory } from '../History/HistoryContext.jsx';
import { getClient, getAccountId } from '../Hedera/client.js';
import { AccountBalanceQuery } from "@hashgraph/sdk";
import AirtimePopup from './AirtimePopup';
import DataBundlePopup from './DataBundlePopup';
import ElectricityPopup from './ElectricityPopup';
import TvSubscriptionPopup from './TvSubscriptionPopup';
import GamingPopup from './GamingPopup';
import { AirtimeIcon, DataIcon, ElectricityIcon, EventIcon, FlightIcon, GamingIcon, HistoryIcon, MovieIcon, TvIcon, BankIcon, MomoIcon, CryptoIcon, MoreIcon } from './icons.jsx';

// Simplified data for the dashboard, fowwwcusing on HBAR
const HBAR_HOLDING = {
  symbol: 'HBAR',
  name: 'Hedera',
  iconColor: '#2ca58d',
  icon: 'H',
};

const MOVERS = [
  { ...HBAR_HOLDING, change: '+1.5%' },
];

const MORE_MENU_ITEMS = [
  { id: 'history', name: 'History', path: '/history', icon: <HistoryIcon /> },
  { id: 'airtime', name: 'Airtime', path: '#', icon: <AirtimeIcon /> },
  { id: 'data', name: 'Data Bundle', path: '#', icon: <DataIcon /> },
  { id: 'electricity', name: 'Electricity', path: '#', icon: <ElectricityIcon /> },
  { id: 'tv', name: 'TV Subscription', path: '#', icon: <TvIcon /> },
  { id: 'gaming', name: 'Sports & Gaming', path: '#', icon: <GamingIcon /> },
  { id: 'events', name: 'Event Tickets', path: '/events', icon: <EventIcon /> },
  { id: 'flights', name: 'Flight Booking', path: '/flights', icon: <FlightIcon /> },
  { id: 'movies', name: 'Movies', path: '/movies', icon: <MovieIcon /> },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { balance: fiatBalance } = useBalance();
  const { history } = useHistory();
  const [activePopup, setActivePopup] = useState(null);

  // Hedera-specific state
  const [hbarBalance, setHbarBalance] = useState(0);
  const [isLoadingHbar, setIsLoadingHbar] = useState(true);
  const [client] = useState(getClient());
  const [accountId] = useState(getAccountId());

  const [profile] = useLocalStorage('allupay_profile', {
    name: 'User',
    email: '',
    avatar: null,
  });

  // Fetch HBAR balance
  const fetchHbarBalance = useCallback(async () => {
    if (!client || !accountId) return;
    setIsLoadingHbar(true);
    try {
      const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
      const accountBalance = await balanceQuery.execute(client);
      setHbarBalance(accountBalance.hbars.toTinybars().toNumber() / 100_000_000);
    } catch (error) {
      console.error("Failed to fetch HBAR balance on dashboard:", error);
    } finally {
      setIsLoadingHbar(false);
    }
  }, [client, accountId]);

  useEffect(() => {
    fetchHbarBalance();
  }, [fetchHbarBalance]);

  const MOCK_HBAR_TO_NGN_RATE = 120;
  const hbarFiatValue = hbarBalance * MOCK_HBAR_TO_NGN_RATE;
  const totalPortfolioValue = fiatBalance + hbarFiatValue;

  const handleMenuClick = (itemId, path) => {
    if (path !== '#') {
      setActivePopup(null); // Close the 'more' menu before navigating
      navigate(path);
    } else {
      setActivePopup(itemId); 
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>A</div>
          <div>
            <div className={styles.title}>Allupay</div>
            <div className={styles.subtitle}>Welcome Back, {profile.name}!</div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Link to="/transfer" className={styles.primaryBtn}>Send Money</Link>
          <Link
            to="/settings"
            className={styles.avatar}
            style={{ backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none' }}
          >
            {!profile.avatar && (profile.name ? profile.name.charAt(0).toUpperCase() : 'U')}
          </Link>
        </div>
      </header>

      {activePopup && (
        <>
          <div className={styles.popupOverlay} onClick={() => setActivePopup(null)} />
          {activePopup === 'more' && (
            <div className={styles.popupMenu}>
            <div className={styles.popupHeader}>
              <div className={styles.popupTitle}>More Options</div>
              <button className={styles.popupClose} onClick={() => setActivePopup(null)}>&times;</button>
            </div>
            <div className={styles.popupContent}>
              {MORE_MENU_ITEMS.map(item => (
                <button key={item.id} className={styles.menuItem} onClick={() => handleMenuClick(item.id, item.path)}>
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
            </div>
          )}
          {activePopup === 'airtime' && <AirtimePopup onClose={() => setActivePopup(null)} />}
          {activePopup === 'data' && <DataBundlePopup onClose={() => setActivePopup(null)} />}
          {activePopup === 'electricity' && <ElectricityPopup onClose={() => setActivePopup(null)} />}
          {activePopup === 'tv' && <TvSubscriptionPopup onClose={() => setActivePopup(null)} />}
          {activePopup === 'gaming' && <GamingPopup onClose={() => setActivePopup(null)} />}
        </>
      )}

      <div className={styles.grid}>
        <div className={styles.portfolioCard}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.hint}>Total Portfolio Value</div>
              <div className={styles.portfolioValue}>₦{totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className={styles.holdings}>
            {/* Fiat Balance Display */}
            <div className={styles.holding}>
              <div className={styles.holdIcon} style={{ color: '#4caf50', fontWeight: 'bold' }}>₦</div>
              <div className={styles.holdInfo}>
                <div className={styles.holdSymbol}>NGN</div>
                <div className={styles.holdName}>Fiat Balance</div>
              </div>
              <div className={styles.holdRight}>
                <div className={styles.holdAmt}>₦{fiatBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            {/* HBAR Balance Display */}
            <div className={styles.holding}>
              <div className={styles.holdIcon} style={{ color: HBAR_HOLDING.iconColor }}>{HBAR_HOLDING.icon}</div>
              <div className={styles.holdInfo}>
                <div className={styles.holdSymbol}>{HBAR_HOLDING.symbol}</div>
                <div className={styles.holdName}>{HBAR_HOLDING.name}</div>
              </div>
              <div className={styles.holdRight}>
                <div className={styles.holdAmt}>{isLoadingHbar ? 'Loading...' : `${hbarBalance.toLocaleString()} ℏ`}</div>
                <div className={styles.holdFiat}>≈ ₦{hbarFiatValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.moversCard}>
          <div className={styles.cardHead}>
            <div className={styles.hint}>Market Movers</div>
          </div>
          <ul className={styles.moversList}>
            {MOVERS.map(m => (
              <li key={m.symbol} className={styles.mover}>
                <div className={styles.moverLeft}>
                  <div className={styles.moverIcon} style={{ color: m.iconColor }}>{m.icon}</div>
                  <div>
                    <div className={styles.moverSymbol}>{m.symbol}</div>
                    <div className={styles.moverName}>{m.name}</div>
                  </div>
                </div>
                <div className={styles.moverPercent} style={{ color: m.change.startsWith('+') ? '#9be6c8' : '#ff8b8b' }}>{m.change}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.activityCard}>
          <div className={styles.cardHead}>
            <div className={styles.hint}>Recent activity</div>
            <Link to="/history" className={styles.btnSmall}>View All</Link>
          </div>
          <div className={styles.activityList}>
            {history.slice(0, 5).map(tx => (
              <div key={tx.id} className={styles.activityItem}>
                <div>
                  <div className={styles.txType}>{tx.type}</div>
                  <div className={styles.txNote}>{tx.note}</div>
                </div>
                <div className={styles.txMeta}>
                  <div className={styles.txAmt} style={{ color: tx.amount.startsWith('+') ? '#9be6c8' : 'white' }}>{tx.amount}</div>
                  <div className={styles.txStatus}>{new Date(tx.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.quickCard}>
          <div className={styles.cardHead}>
            <div className={styles.hint}>Quick Actions</div>
          </div>
          <div className={styles.quickGrid}>
            <Link to="/transfer" className={styles.quickAction}><BankIcon /> Bank</Link>
            <Link to="/momo" className={styles.quickAction}><MomoIcon /> Momo</Link>
            <Link to="/cryptocurrency" className={styles.quickAction}><CryptoIcon /> Crypto</Link>
            <button className={styles.quickAction} onClick={() => setActivePopup('more')}><MoreIcon /> More</button>
          </div>
        </div>
      </div>
    </div>
  );
}