import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Help.module.css';

const FAQ = [
  {
    id: 'faq-1',
    q: 'How do I send crypto from my wallet?',
    a: 'Go to "Cryptocurrency" → choose asset → enter recipient address and amount → confirm. This demo app mocks network sends.',
  },
  {
    id: 'faq-2',
    q: 'How do I request a bank transfer?',
    a: 'Open "Transfer" → select Bank → enter bank details and amount → confirm. Transfers are simulated in this demo.',
  },
  {
    id: 'faq-3',
    q: 'How is my data stored?',
    a: 'All settings and mock history are stored locally in your browser localStorage. No server is contacted by the demo.',
  },
  {
    id: 'faq-4',
    q: 'How do I export my profile data?',
    a: 'From Settings → Privacy → "Export profile". That generates a JSON download of your settings.',
  },
  {
    id: 'faq-5',
    q: 'Can I delete my account?',
    a: 'Yes — use "Delete account (mock)" in Privacy. That clears demo local data but does not affect any real accounts.',
  },
  {
    id: 'faq-6',
    q: 'Why can’t I send funds for real?',
    a: 'This application is a UI demo. Transfers and balances are mocked for demonstration only.',
  },
];

export default function Help() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return FAQ;
    return FAQ.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Help & FAQ</h1>
          <div className={styles.subtitle}>Search common questions and troubleshooting</div>
        </div>

        <div className={styles.headerActions}>
          <Link to="/settings" className={styles.ghost}>Back to Settings</Link>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.searchCard}>
          <input
            className={styles.search}
            placeholder="Search FAQs (e.g. export, transfer, privacy)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search FAQs"
          />
          <div className={styles.hint}>Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
        </section>

        <section className={styles.faqCard}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>No FAQs match your search.</div>
          ) : (
            <ul className={styles.faqList}>
              {filtered.map(item => (
                <li key={item.id} className={styles.faqItem}>
                  <button
                    className={styles.q}
                    onClick={() => setOpen(open === item.id ? null : item.id)}
                    aria-expanded={open === item.id}
                    aria-controls={`${item.id}-ans`}
                  >
                    <span>{item.q}</span>
                    <span className={styles.chev}>{open === item.id ? '−' : '+'}</span>
                  </button>

                  <div
                    id={`${item.id}-ans`}
                    className={`${styles.a} ${open === item.id ? styles.aOpen : ''}`}
                    role="region"
                    aria-hidden={open !== item.id}
                  >
                    {item.a}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}