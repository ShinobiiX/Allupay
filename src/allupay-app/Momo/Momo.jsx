import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import detailsStyles from '../Events/EventDetails.module.css'; // For popup styles
import styles from './Momo.module.css';
import { useHistory } from '../History/HistoryContext';
import { useBalance } from '../Balance/BalanceContext'; // Assuming BalanceContext is in src/allupay-app/Balance
import Spinner from '../Common/Spinner.jsx';
import { COUNTRIES_AND_MOMO_NETWORKS } from './momo-data.js';

// Mock exchange rates (same as Bank page for consistency)
const CURRENCIES = {
    NGN: { name: 'Nigerian Naira', symbol: '₦', rate: 1 },
    GHS: { name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 0.088 },
    XOF: { name: 'CFA Franc BCEAO', symbol: 'CFA', rate: 0.41 },
    KES: { name: 'Kenyan Shilling', symbol: 'KSh', rate: 0.092 },
    TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', rate: 1.74 },
    UGX: { name: 'Ugandan Shilling', symbol: 'USh', rate: 2.52 },
    RWF: { name: 'Rwandan Franc', symbol: 'FRw', rate: 0.88 },
    ETB: { name: 'Ethiopian Birr', symbol: 'Br', rate: 0.039 },
    ZAR: { name: 'South African Rand', symbol: 'R', rate: 0.012 },
    ZMW: { name: 'Zambian Kwacha', symbol: 'ZK', rate: 0.17 },
    ZWL: { name: 'Zimbabwean Dollar', symbol: 'Z$', rate: 0.0008 },
    AOA: { name: 'Angolan Kwanza', symbol: 'Kz', rate: 0.56 },
    CDF: { name: 'Congolese Franc', symbol: 'FC', rate: 1.88 },
};

export default function Momo() {
    const { addTransaction } = useHistory();
    const { balance, deductBalance } = useBalance();
    const navigate = useNavigate();

    const [country, setCountry] = useState('NG'); // Default to Nigeria for consistency
    const [network, setNetwork] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [amount, setAmount] = useState('');
    const [narration, setNarration] = useState('');

    const [showPinPad, setShowPinPad] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');

    const selectedCountryData = COUNTRIES_AND_MOMO_NETWORKS[country];
    const currency = selectedCountryData.currency;

    // New: Calculate the cost in NGN based on the amount entered in the destination currency
    const ngnCost = (amount / (CURRENCIES[currency]?.rate || 1)) * CURRENCIES['NGN'].rate;

    // Convert the base NGN balance to the selected country's currency for display
    const targetCurrencyInfo = CURRENCIES[currency] || CURRENCIES['NGN'];
    const displayedBalance = balance * targetCurrencyInfo.rate;

    useEffect(() => {
        // Reset network, phone number, and recipient name when country changes
        setNetwork('');
        setPhoneNumber('');
        setRecipientName('');
        setVerificationMessage('');
    }, [country]);

    useEffect(() => {
        // Simulate phone number verification
        if (phoneNumber.length >= 8 && selectedCountryData.mockAccounts) { // Check for 8+ digits to include countries like Benin/Togo
            setIsVerifying(true);
            setVerificationMessage('');
            setRecipientName('');
            setTimeout(() => {
                const foundName = selectedCountryData.mockAccounts?.[phoneNumber];
                if (foundName) {
                    setRecipientName(foundName);
                } else {
                    setVerificationMessage('Phone number not found');
                }
                setIsVerifying(false);
            }, 1000);
        } else if (phoneNumber.length < 8) {
            setRecipientName('');
            setVerificationMessage('');
            setIsVerifying(false);
        }
    }, [phoneNumber, selectedCountryData]);

    const handleTransfer = (e) => {
        e.preventDefault();
        if (!country || !network || !phoneNumber || !amount || !recipientName) {
            alert('Please fill all required fields.');
            return;
        }
        if (ngnCost > balance) {
            alert('Insufficient balance for this transaction.');
            return;
        }
        setShowPinPad(true);
    };

    const handlePinConfirm = () => {
        if (pin === '1234') { // Mock PIN
            addTransaction({
                type: 'Momo Transfer',
                amount: `${CURRENCIES[currency].symbol}${parseFloat(amount).toFixed(2)}`,
                note: `To: ${recipientName} (${network})`,
                currency: currency,
                filterCategory: 'Momo',
            });
            deductBalance(ngnCost);
            alert('Momo Transfer Successful!');
            setShowPinPad(false);
            navigate('/dashboard');
        } else {
            setPinError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

  return (
    <>
        <div className={`${styles.send_main} ${showPinPad ? detailsStyles.blurred : ''}`}>
            <section className={styles.paymentMethods}>
                <Link to="/transfer" className={styles.methodBtn}>Bank</Link>
                <button className={`${styles.methodBtn} ${styles.activeMethod}`}>Momo</button>
                <Link to="/cryptocurrency" className={styles.methodBtn}>Crypto</Link>
            </section>

            <main className={styles.container}>
                <section className={styles.card}>
                    <header className={styles.header}>
                        <div>
                            <h2 className={styles.title}>Send Mobile Money</h2>
                            <div className={styles.subtitle}>Fast. Secure. Sleek.</div>
                        </div>
                        <div className={styles.meta}>
                            <div className={styles.metaLabel}>Available Balance</div>
                            <div className={styles.metaValue}>{targetCurrencyInfo.symbol}{displayedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </header>

                    <form className={styles.sendForm} onSubmit={handleTransfer}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="country">Destination Country</label>
                            <select id="country" value={country} onChange={e => setCountry(e.target.value)}>
                                {Object.keys(COUNTRIES_AND_MOMO_NETWORKS).map(code => (
                                    <option key={code} value={code}>{COUNTRIES_AND_MOMO_NETWORKS[code].name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="network">Mobile Network</label>
                            <select id="network" value={network} onChange={e => setNetwork(e.target.value)} required>
                                <option value="" disabled>Select a network</option>
                                {selectedCountryData.networks.map(net => (
                                    <option key={net} value={net}>{net}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="phoneNumber">Phone Number</label>
                                <input id="phoneNumber" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g., 0241234567" required />                                
                                {isVerifying && <div className={styles.verificationStatus}><Spinner /></div>}
                                {verificationMessage && <div className={`${styles.verificationStatus} ${styles.error}`}>{verificationMessage}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="recipientName">Recipient Name</label>
                                <input
                                    id="recipientName"
                                    type="text" value={recipientName}
                                    onChange={e => setRecipientName(e.target.value)}
                                    placeholder="Recipient name will appear here"
                                    required
                                    readOnly // Name should be auto-filled
                                />
                            </div>
                        </div>
                        <div className={styles.amountGroup}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="amount">Amount ({targetCurrencyInfo.name})</label>
                                <input id="amount" type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100.00" required />
                            </div>
                            <div className={styles.convertedAmount}>
                                ≈ {CURRENCIES['NGN'].symbol}{ngnCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="narration">Narration (Optional)</label>
                            <input id="narration" type="text" value={narration} onChange={e => setNarration(e.target.value)} placeholder="e.g., For groceries" />
                        </div>
                        <div className={styles.actions}>
                            <button type="submit" className={styles.primary}>Send Money</button>
                        </div>
                    </form>
                </section>

                <aside className={styles.sideCard}>
                    <div className={styles.sideHeader}>
                        <h3>Momo Tips</h3>
                        <div className={styles.tipSmall}>Mock environment</div>
                    </div>
                    <div className={styles.sideBody}>
                        <div className={styles.infoRow}>
                            <div className={styles.infoKey}>Processing</div>
                            <div className={styles.infoVal}>Instant (mock)</div>
                        </div>
                        <ul className={styles.tips}>
                            <li>Ensure network is correct for the country.</li>
                            <li>Amounts are mocked — this is not a live transfer.</li>
                            <li>Use local phone number format (e.g., 024xxxxxxx).</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>

        {showPinPad && (
            <>
                <div className={detailsStyles.popupOverlay} onClick={() => setShowPinPad(false)} />
                <div className={detailsStyles.pinPopup}>
                    <div className={detailsStyles.popupTitle}>Enter PIN</div>
                    <p className={detailsStyles.pinSubtitle}>Confirm transfer of ≈ ₦{ngnCost.toLocaleString()}</p>
                    <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setPinError(''); }} maxLength="4" autoFocus className={detailsStyles.pinInput} placeholder="----" />
                    {pinError && <p className={detailsStyles.pinError}>{pinError}</p>}
                    <button onClick={handlePinConfirm} className={detailsStyles.purchaseButton}>Confirm Transfer</button>
                </div>
            </>
        )}
    </>
  );
}