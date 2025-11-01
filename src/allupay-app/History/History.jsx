import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from './HistoryContext.jsx';
import styles from './History.module.css';

// Mock data for stats, replace with real data if available
const MOCK_STATS = {
  totalSpent: 450000,
  totalReceived: 120000,
  transactions: 25,
};

export default function History() {
  const { history } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = useMemo(() => {
    return history.filter(tx => {
      const txTypeLower = tx.type.toLowerCase();
      let categoryMatch = false;
      if (filterType === 'all') {
        categoryMatch = true;
      } else if (filterType === 'bank') {
        categoryMatch = txTypeLower.includes('bank') || 
                        txTypeLower.includes('utility') ||
                        txTypeLower.includes('flight') ||
                        txTypeLower.includes('data') ||
                        txTypeLower.includes('airtime') ||
                        txTypeLower.includes('movie');
      } else {
        categoryMatch = txTypeLower.includes(filterType);
      }
      const searchMatch =
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [history, searchQuery, filterType]);

  const getBadgeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'crypto':
        return styles.badgeCrypto;
      case 'momo':
        return styles.badgeMomo;
      case 'bank':
        return styles.badgeBank;
      default:
        return '';
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Transaction History</h1>
          <p className={styles.subtitle}>View and manage your past transactions.</p>
        </div>
        <div className={styles.controls}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search by type, note, amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.filterRow}>
            <select
              className={styles.select}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="bank">Bank</option>
              <option value="momo">Momo</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.listCard}>
          <div className={styles.listHead}>
            <div className={styles.headTitle}>All Transactions</div>
            <div className={styles.headMeta}>
              <span className={styles.metaItem}>Total: <strong>{filteredHistory.length}</strong></span>
            </div>
          </div>
          <div className={styles.txList}>
            {filteredHistory.length > 0 ? (
              filteredHistory.map(tx => (
                <div key={tx.id} className={styles.tx}>
                  <div className={styles.txLeft}>
                    <div className={`${styles.txBadge} ${getBadgeClass(tx.type)}`}>
                      {tx.type.substring(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.txInfo}>
                      <div className={styles.txType}>{tx.type}</div>
                      <div className={styles.txNote}>{tx.note}</div>
                    </div>
                  </div>
                  <div className={styles.txRight}>
                    <div className={styles.txAmt} style={{ color: tx.amount.startsWith('+') ? '#9be6c8' : 'white' }}>
                      {tx.amount}
                    </div>
                      <div className={styles.txMeta}>
                        <div className={styles.txStatus}>{new Date(tx.date).toLocaleDateString()}</div>
                        {tx.transactionId && (
                          <a href={`https://hashscan.io/testnet/transaction/${tx.transactionId.toString()}`} target="_blank" rel="noopener noreferrer" className={styles.txLink}>
                            View on Explorer
                          </a>
                        )}
                      </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty}>No transactions found.</div>
            )}
          </div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.sideHead}>Summary</div>
          <div className={styles.sideBody}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Spent</span>
              <span className={styles.statValue}>₦{MOCK_STATS.totalSpent.toLocaleString()}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Received</span>
              <span className={styles.statValue}>₦{MOCK_STATS.totalReceived.toLocaleString()}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Transactions</span>
              <span className={styles.statValue}>{MOCK_STATS.transactions}</span>
            </div>
            <div className={styles.sectionTitle}>Quick filters</div>
            <div className={styles.quickFilters}>
              <button className={styles.filterBtn} onClick={() => setFilterType('all')}>All</button>
              <button className={styles.filterBtn} onClick={() => setFilterType('bank')}>Bank</button>
              <button className={styles.filterBtn} onClick={() => setFilterType('momo')}>Momo</button>
              <button className={styles.filterBtn} onClick={() => setFilterType('crypto')}>Crypto</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
