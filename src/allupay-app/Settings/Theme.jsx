import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Theme.module.css';

const applyTheme = (mode) => {
  const resolved = mode === 'system'
    ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;
  document.documentElement.setAttribute('data-theme', resolved);
};

export default function Theme() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('system');

  useEffect(() => {
    const saved = localStorage.getItem('settings_theme') || 'system';
    setMode(saved);
    applyTheme(saved);
    // listen for system changes when in system mode
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (saved === 'system') applyTheme('system'); };
    if (mq && mq.addEventListener) mq.addEventListener('change', handleChange);
    return () => { if (mq && mq.removeEventListener) mq.removeEventListener('change', handleChange); };
  }, []);

  useEffect(() => {
    localStorage.setItem('settings_theme', mode);
    applyTheme(mode);
  }, [mode]);

  const options = [
    { id: 'light', label: 'Light', desc: 'Bright interface' },
    { id: 'dark', label: 'Dark', desc: 'Easy on the eyes at night' },
    { id: 'system', label: 'System', desc: 'Use device preference' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className={styles.title}>Theme</h2>
      </header>

      <main className={styles.wrap}>
        <section className={styles.card}>
          <p className={styles.lead}>Choose appearance. Changes apply instantly.</p>

          <div className={styles.options}>
            {options.map(opt => (
              <label key={opt.id} className={styles.option}>
                <input
                  type="radio"
                  name="theme"
                  value={opt.id}
                  checked={mode === opt.id}
                  onChange={() => setMode(opt.id)}
                />
                <div className={styles.meta}>
                  <div className={styles.optLabel}>{opt.label}</div>
                  <div className={styles.optDesc}>{opt.desc}</div>
                </div>
                <div className={styles.radio}>
                  <span className={styles.radioOuter} aria-hidden>
                    <span className={`${styles.radioInner} ${mode === opt.id ? styles.checked : ''}`} />
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className={styles.previewWrap}>
            <div className={styles.previewLabel}>Preview</div>
            <div className={styles.preview}>
              <div className={styles.previewCard}>
                <div className={styles.previewTitle}>Allupay</div>
                <div className={styles.previewBody}>Theme: <strong>{mode}</strong></div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.ghost} onClick={() => { localStorage.removeItem('settings_theme'); setMode('system'); }}>Reset</button>
            <button className={styles.primary} onClick={() => alert('Theme saved')}>Save</button>
          </div>
        </section>
      </main>
    </div>
  );
}