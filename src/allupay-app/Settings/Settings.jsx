import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import { useLocalStorage } from '../Hooks/useLocalStorage.jsx';
import { useTheme } from '../Hooks/useTheme.jsx';

export default function Settings() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useLocalStorage('allupay_profile', {
        name: 'Egasn',
        email: 'egasnonorim@gmail.com',
        bio: 'Web3 Enthusiast | Building the future of finance.',
        avatar: null, // Will store image as data URL
    });

    const [tempProfile, setTempProfile] = useState(profile);
    const [toast, setToast] = useState('');

    useEffect(() => {
        setTempProfile(profile);
    }, [profile]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setTempProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setProfile(tempProfile);
        setTheme(theme); // This will save the current theme to localStorage via the useTheme hook
        setToast('Settings saved successfully!');
        setTimeout(() => setToast(''), 3000);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out? This will clear your local data.')) {
            localStorage.removeItem('allupay_profile');
            localStorage.removeItem('allupay_balance');
            localStorage.removeItem('allupay_history');
            localStorage.removeItem('allupay_theme');
            // You might want to add more keys here if you add more to localStorage
            window.location.href = '/dashboard'; // Full reload to clear all state
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.settingsContainer}>
                <h1 className={styles.title}>Settings</h1>

                {toast && <div className={styles.toast}>{toast}</div>}

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Profile</h2>
                    <div className={styles.profileRow}>
                        <div className={styles.avatarWrap}>
                            <div className={styles.avatarPreview} style={{ backgroundImage: `url(${tempProfile.avatar})` }}>
                                {!tempProfile.avatar && <span className={styles.avatarInitials}>EG</span>}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                            <button className={styles.ghost} onClick={() => fileInputRef.current.click()}>Change Photo</button>
                        </div>
                        <div className={styles.profileFields}>
                            <div className={styles.field}>
                                <label htmlFor="name">Full Name</label>
                                <input id="name" type="text" value={tempProfile.name} onChange={handleInputChange} />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="email">Email Address</label>
                                <input id="email" type="text" value={tempProfile.email} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.field} style={{ marginTop: '16px' }}>
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" value={tempProfile.bio} onChange={handleInputChange}></textarea>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Appearance</h2>
                    <div className={styles.setting}>
                        <label>
                            <strong>Theme</strong>
                            <span>Switch between light and dark mode</span>
                        </label>
                        <div className={styles.themeBtns}>
                            <button className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`} onClick={() => setTheme('light')}>Light</button>
                            <button className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`} onClick={() => setTheme('dark')}>Dark</button>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Security</h2>
                    <div className={styles.setting}>
                        <label>
                            <strong>Password</strong>
                            <span>Last changed 1 month ago</span>
                        </label>
                        <button className={styles.button} onClick={() => alert('Feature not implemented.')}>Change</button>
                    </div>
                    <div className={styles.setting}>
                        <label>
                            <strong>Two-Factor Authentication</strong>
                            <span>Add an extra layer of security</span>
                        </label>
                        <button className={styles.button} onClick={() => alert('Feature not implemented.')}>Enable</button>
                    </div>
                </div>

                <div className={styles.section}>
                     <h2 className={styles.sectionTitle}>Account Actions</h2>
                    <div className={styles.setting}>
                        <label>
                            <strong>Log Out</strong>
                            <span>You will be returned to the main screen.</span>
                        </label>
                        <button className={styles.button} style={{backgroundColor: '#e53e3e'}} onClick={handleLogout}>Log Out</button>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button className={styles.ghost} onClick={() => navigate('/dashboard')}>Cancel</button>
                    <button className={styles.primary} onClick={handleSave}>Save Settings</button>
                </div>
            </div>
        </div>
    );
}