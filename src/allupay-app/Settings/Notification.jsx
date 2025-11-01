import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';
import { useNavigate } from 'react-router-dom';

function Toggle({ id, checked, onChange }) {
  return (
    <label className={styles.switch} htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.track} aria-hidden />
    </label>
  );
}

export default function Notification() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
  });

  useEffect(() => {
    const raw = localStorage.getItem('settings_notification');
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('settings_notification', JSON.stringify(settings));
  }, [settings]);

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className={styles.title}>Notification</h2>
      </header>

      <main className={styles.wrap}>
        <section className={styles.card}>
          <p className={styles.lead}>Control how you receive updates and alerts.</p>

          <div className={styles.row}>
            <div className={styles.meta}>
              <div className={styles.label}>Email</div>
              <div className={styles.sub}>Receive notification emails (account activity, receipts)</div>
            </div>
            <Toggle id="notif-email" checked={settings.email} onChange={(v) => set('email', v)} />
          </div>

          <div className={styles.row}>
            <div className={styles.meta}>
              <div className={styles.label}>Push</div>
              <div className={styles.sub}>Real-time push notifications on your device</div>
            </div>
            <Toggle id="notif-push" checked={settings.push} onChange={(v) => set('push', v)} />
          </div>

          <div className={styles.row}>
            <div className={styles.meta}>
              <div className={styles.label}>SMS</div>
              <div className={styles.sub}>Critical alerts via SMS</div>
            </div>
            <Toggle id="notif-sms" checked={settings.sms} onChange={(v) => set('sms', v)} />
          </div>

          <div className={styles.row}>
            <div className={styles.meta}>
              <div className={styles.label}>Marketing</div>
              <div className={styles.sub}>Promotions and product updates</div>
            </div>
            <Toggle id="notif-marketing" checked={settings.marketing} onChange={(v) => set('marketing', v)} />
          </div>

          <div className={styles.footer}>
            <button className={styles.secondary} onClick={() => { localStorage.removeItem('settings_notification'); setSettings({ email: true, push: false, sms: false, marketing: false }); }}>Reset</button>
            <button className={styles.primary} onClick={() => alert('Notification settings saved')}>Save</button>
          </div>
        </section>
      </main>
    </div>
  );
}