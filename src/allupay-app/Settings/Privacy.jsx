import React, { useEffect, useState } from 'react';
import styles from './Privacy.module.css';
import { useNavigate } from 'react-router-dom';

function Toggle({ id, checked, onChange }) {
  return (
    <label className={styles.switch} htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.track} aria-hidden />
    </label>
  );
}

export default function Privacy() {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    analytics: true,
    safeSearch: true,
    dataSharing: false,
  });

  useEffect(() => {
    const raw = localStorage.getItem('settings_privacy');
    if (raw) setPrivacy(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('settings_privacy', JSON.stringify(privacy));
  }, [privacy]);

  const set = (k, v) => setPrivacy(s => ({ ...s, [k]: v }));

  function clearLocal() {
    if (!confirm('Clear all saved local settings? This cannot be undone.')) return;
    localStorage.removeItem('settings_account');
    localStorage.removeItem('settings_notification');
    localStorage.removeItem('settings_privacy');
    localStorage.removeItem('settings_theme');
    setPrivacy({ profileVisible: true, analytics: true, safeSearch: true, dataSharing: false });
    alert('Local settings cleared.');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className={styles.title}>Privacy & Safety</h2>
      </header>

      <main className={styles.wrap}>
        <section className={styles.card}>
          <p className={styles.lead}>Manage what others can see and how your data is used.</p>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Profile</div>

            <div className={styles.row}>
              <div className={styles.meta}>
                <div className={styles.label}>Profile visibility</div>
                <div className={styles.sub}>Allow others to view your profile and activity</div>
              </div>
              <Toggle id="privacy-profile" checked={privacy.profileVisible} onChange={(v) => set('profileVisible', v)} />
            </div>

            <div className={styles.row}>
              <div className={styles.meta}>
                <div className={styles.label}>Safe search</div>
                <div className={styles.sub}>Filter explicit content from feed and search</div>
              </div>
              <Toggle id="privacy-safe" checked={privacy.safeSearch} onChange={(v) => set('safeSearch', v)} />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Data</div>

            <div className={styles.row}>
              <div className={styles.meta}>
                <div className={styles.label}>Usage analytics</div>
                <div className={styles.sub}>Send anonymous analytics to help improve the product</div>
              </div>
              <Toggle id="privacy-analytics" checked={privacy.analytics} onChange={(v) => set('analytics', v)} />
            </div>

            <div className={styles.row}>
              <div className={styles.meta}>
                <div className={styles.label}>Share data with partners</div>
                <div className={styles.sub}>Allow limited sharing for personalized offers</div>
              </div>
              <Toggle id="privacy-sharing" checked={privacy.dataSharing} onChange={(v) => set('dataSharing', v)} />
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.secondary} onClick={() => { /* export mock data */ alert('Preparing a data export (mock)'); }}>Request data export</button>
            <div className={styles.actionsRight}>
              <button className={styles.ghost} onClick={clearLocal}>Clear local settings</button>
              <button className={styles.primary} onClick={() => alert('Privacy settings saved')}>Save</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}