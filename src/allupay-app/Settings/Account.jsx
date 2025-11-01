import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Account.module.css';

export default function Account() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    avatar: ''
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem('settings_account');
    if (raw) {
      try { setProfile(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  function validate(p) {
    const e = {};
    if (!p.name.trim()) e.name = 'Name is required';
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e.email = 'Invalid email';
    if (p.username && !/^[a-zA-Z0-9._-]{3,30}$/.test(p.username)) e.username = '3–30 chars: letters, numbers, . _ -';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleAvatarFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    const reader = new FileReader();
    setBusy(true);
    reader.onload = (ev) => {
      setProfile(prev => ({ ...prev, avatar: ev.target.result }));
      setBusy(false);
    };
    reader.onerror = () => { setBusy(false); alert('Failed to read file'); };
    reader.readAsDataURL(file);
  }

  function onFileInput(e) {
    const f = e.target.files?.[0];
    if (f) handleAvatarFile(f);
  }

  function triggerFile() { fileRef.current?.click(); }

  function removeAvatar() { setProfile(prev => ({ ...prev, avatar: '' })); }

  function resetAll() {
    if (!confirm('Reset account fields to defaults?')) return;
    localStorage.removeItem('settings_account');
    setProfile({ name: '', email: '', username: '', bio: '', avatar: '' });
    setErrors({});
  }

  function save(e) {
    e?.preventDefault();
    const v = validate(profile);
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      localStorage.setItem('settings_account', JSON.stringify(profile));
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch {
      alert('Failed to save');
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className={styles.title}>Your Account</h2>
      </header>

      <main className={styles.wrap}>
        <form className={styles.card} onSubmit={save} noValidate>
          <div className={styles.topRow}>
            <div className={styles.avatarBox}>
              <div className={styles.avatar}>
                {profile.avatar ? <img src={profile.avatar} alt="Avatar preview" /> : <div className={styles.placeholder}>A</div>}
                {busy && <div className={styles.busy}>Updating…</div>}
              </div>

              <div className={styles.avatarBtns}>
                <button type="button" className={styles.changeBtn} onClick={triggerFile} aria-label="Change avatar">Change</button>
                {profile.avatar && <button type="button" className={styles.removeBtn} onClick={removeAvatar}>Remove</button>}
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileInput} style={{ display: 'none' }} />
              </div>
            </div>

            <div className={styles.meta}>
              <div className={styles.namePreview}>{profile.name || <span className={styles.hint}>Your name</span>}</div>
              <div className={styles.emailPreview}>{profile.email || <span className={styles.hint}>you@example.com</span>}</div>
            </div>
          </div>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.label}>Full name</span>
              <input name="name" value={profile.name} onChange={handleChange} placeholder="John Doe" />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input name="email" value={profile.email} onChange={handleChange} placeholder="you@example.com" type="email" />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Username</span>
              <input name="username" value={profile.username} onChange={handleChange} placeholder="johndoe" />
              <div className={styles.help}>Public handle — 3–30 characters</div>
              {errors.username && <div className={styles.error}>{errors.username}</div>}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Bio</span>
              <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Short bio" rows={3} />
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.ghost} onClick={resetAll}>Reset</button>
            <button type="submit" className={styles.primary}>Save changes</button>
          </div>

          {saved && <div className={styles.toast}>Profile saved</div>}
        </form>
      </main>
    </div>
  );
}